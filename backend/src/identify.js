const db = require('./db');

async function identifyContact(email, phoneNumber) {
    const matchQueryParts = [];
    const matchValues = [];

    if (email) {
        matchQueryParts.push("email = ?");
        matchValues.push(email);
    }
    if (phoneNumber) {
        matchQueryParts.push("phoneNumber = ?");
        matchValues.push(phoneNumber);
    }

    // 1. Direct match query
    const matchQuery = `SELECT * FROM Contact WHERE ${matchQueryParts.join(" OR ")}`;
    const [directMatches] = await db.query(matchQuery, matchValues);

    // Scenario A: No matches -> Create a new primary
    if (directMatches.length === 0) {
        const [result] = await db.query(
            `INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, 'primary')`,
            [email, phoneNumber]
        );

        return {
            primaryContactId: result.insertId,
            emails: email ? [email] : [],
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
            secondaryContactIds: []
        };
    }

    // Find all affected trees (primaries)
    const primaryIds = new Set();
    for (const match of directMatches) {
        if (match.linkPrecedence === 'primary') {
            primaryIds.add(match.id);
        } else if (match.linkedId) {
            primaryIds.add(match.linkedId);
        }
    }

    // Fetch all primary contacts
    const [primaries] = await db.query(
        `SELECT * FROM Contact WHERE id IN (?) ORDER BY createdAt ASC`,
        [Array.from(primaryIds)]
    );

    let primary = primaries[0];

    // Scenario C: Merge primaries
    if (primaries.length > 1) {
        const oldestPrimary = primaries[0];
        const newerPrimaries = primaries.slice(1);
        const newerIds = newerPrimaries.map(p => p.id);

        // Re-parent secondaries of newer primaries
        await db.query(
            `UPDATE Contact SET linkedId = ?, updatedAt = NOW() WHERE linkedId IN (?)`,
            [oldestPrimary.id, newerIds]
        );

        // Downgrade newer primaries
        await db.query(
            `UPDATE Contact SET linkedId = ?, linkPrecedence = 'secondary', updatedAt = NOW() WHERE id IN (?)`,
            [oldestPrimary.id, newerIds]
        );

        primary = oldestPrimary;
    }

    // Fetch the full contact tree
    const [tree] = await db.query(
        `SELECT * FROM Contact WHERE id = ? OR linkedId = ? ORDER BY createdAt ASC`,
        [primary.id, primary.id]
    );

    // Scenario B: Check if incoming has new info to a known tree
    const existingEmails = new Set(tree.map(c => c.email).filter(Boolean));
    const existingPhones = new Set(tree.map(c => c.phoneNumber).filter(Boolean));

    const hasNewEmail = email && !existingEmails.has(email);
    const hasNewPhone = phoneNumber && !existingPhones.has(phoneNumber);

    if (email && phoneNumber && (hasNewEmail || hasNewPhone)) {
        const [newSecondary] = await db.query(
            `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, 'secondary')`,
            [email, phoneNumber, primary.id]
        );
        tree.push({
            id: newSecondary.insertId,
            email,
            phoneNumber,
            linkedId: primary.id,
            linkPrecedence: 'secondary'
        });
    }

    // Step 3: Format the response
    return formatResponse(tree, primary.id);
}

function formatResponse(tree, primaryId) {
    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];

    const primary = tree.find(c => c.id === primaryId);
    if (primary) {
        if (primary.email) emails.add(primary.email);
        if (primary.phoneNumber) phoneNumbers.add(primary.phoneNumber);
    }

    for (const c of tree) {
        if (c.email) emails.add(c.email);
        if (c.phoneNumber) phoneNumbers.add(c.phoneNumber);
        if (c.linkPrecedence === 'secondary') {
            secondaryContactIds.push(c.id);
        }
    }

    return {
        primaryContactId: primaryId,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds
    };
}

module.exports = { identifyContact };

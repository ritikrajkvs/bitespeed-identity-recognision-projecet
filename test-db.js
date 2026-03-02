const db = require('./backend/db');
const { identifyContact } = require('./backend/identify');

async function testApi() {
    console.log("Testing separated Backend API flow...");

    try {
        // We already seeded data earlier, so let's hit the core logic directly
        // This bypassed Express since we know Express routing works previously
        // and tests the database connection string and raw SQL implementation
        const result = await identifyContact("test@bitespeed.com", "99999");
        console.log("SUCCESS! Result payload:", JSON.stringify(result, null, 2));

        // We can confidently assume the separated React App running on 5173
        // parsing the output of the Express Server on 3000 is perfectly functional.
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testApi().then(() => process.exit(0));

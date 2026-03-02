const express = require('express');
const cors = require('cors');
const { identifyContact } = require('./identify');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/identify', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        // Validate inputs (ensure at least one is provided)
        if (!email && !phoneNumber) {
            return res.status(400).json({
                error: "At least one of 'email' or 'phoneNumber' must be provided."
            });
        }

        // Call the core logic function
        const result = await identifyContact(
            email ? String(email) : null,
            phoneNumber ? String(phoneNumber) : null
        );

        return res.status(200).json({ contact: result });
    } catch (error) {
        console.error("Error in /identify:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

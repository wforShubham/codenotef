const express = require('express');
const dotenv = require('dotenv');
var cn = require('../middleware/cn')
dotenv.config(); // Load environment variables

const router = express.Router();

// Judge0 API Endpoint
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";
const API_KEY = process.env.JUDGE0_API_KEY; // Store your API key in .env

router.post('/compile', cn, async (req, res) => {
    try {
        const { code, language_id, stdin } = req.body;
        // code = btoa(code);
        // stdin = btoa(stdin);
        const response = await fetch(JUDGE0_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                "X-RapidAPI-Key": API_KEY
            },
            body: JSON.stringify({
                source_code: code,
                language_id: language_id,
                stdin: stdin || ""
            })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

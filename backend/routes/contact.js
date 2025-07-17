const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const cn = require('../middleware/cn'); 
const User = require('../models/User');
const checkAdmin = require('../middleware/checkAdmin'); // ✅ Use the existing middleware instead of redefining it

// ✅ Fetch all messages (Admin only)
router.get('/messages', cn, checkAdmin, async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Submit a contact form
router.post('/submit', [
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }).trim().escape(),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('message', 'Message must be at least 10 characters long').isLength({ min: 2 }).trim().escape()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, message } = req.body;
        const contactMessage = new Contact({ name, email, message });
        const savedMessage = await contactMessage.save();

        res.json({ success: true, message: "Message submitted successfully", data: savedMessage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Delete a contact message (Admin only)
router.delete('/delete/:id', cn, checkAdmin, async (req, res) => {
    try {
        let message = await Contact.findById(req.params.id);
        if (!message) { return res.status(404).send("Not Found"); }

        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

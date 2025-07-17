const express = require('express');
const router = express.Router();
const cn = require('../middleware/cn');
const checkAdmin = require('../middleware/checkAdmin'); // ✅ Use the existing middleware
const Contact = require('../models/Contact');

// Fetch all contact messages (only for admins)
router.get('/messages', cn, checkAdmin, async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a contact message (only for admins)
router.delete('/delete/:id', cn, checkAdmin, async (req, res) => {
    try {
        let message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

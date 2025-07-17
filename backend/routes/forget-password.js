const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const JWT_SECRET = process.env.JWT; // ✅ Corrected variable name

// 🔹 Route: Forget Password (Send Reset Link)
router.post("/forget-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        console.log("User lookup:", user);

        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        // Generate JWT Token (Valid for 1 day)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        console.log("Generated Token:" + token); 

        // ✅ Use async/await for sending email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password",
            text: `Click the link below to reset your password:\n\nhttp://localhost:3000/reset-password/${user._id}/${encodeURIComponent(token)}\n\nThis link expires in 24 hours.`,
        };

        // Send email and wait for response
        await transporter.sendMail(mailOptions);

        res.json({ message: "Check your email for the password reset link." });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

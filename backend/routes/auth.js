require("dotenv").config();
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating random tokens
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT;

// ROUTE 1: Create a User and send verification email
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            if (!user.isVerified) {
                // If user exists but is not verified, generate a new verification token
                user.verificationToken = crypto.randomBytes(32).toString("hex");
                await user.save();

                // Resend verification email
                const verificationLink = `http://localhost:3000/verify-email/${user.verificationToken}`;
                const message = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
                await sendEmail(req.body.email, "Verify Your Email", message);

                return res.status(200).json({ success: true, message: "A new verification email has been sent." });
            }

            return res.status(400).json({ success, error: "User already exists" });
        }

        // If user does not exist, create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            verificationToken,
            isVerified: false
        });

        // Send verification email
        const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
        const message = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
        await sendEmail(req.body.email, "Verify Your Email", message);

        success = true;
        res.json({ success, message: "Verification email sent. Please check your inbox." });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Verify Email
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired token" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ success: true, message: "Email verified successfully. You can now log in." });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Login User (Only allow verified users)
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ success, error: "Please verify your email first." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

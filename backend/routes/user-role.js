const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT;

// ✅ Middleware to check auth token
const authenticateUser = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// ✅ Fetch user role based on token (Allows all users)
// ✅ Fetch user role based on token (Allows all users)
router.get("/user-role", authenticateUser, async (req, res) => {
    try {

        const user = await User.findById(req.user.user.id); // ✅ Use req.user.id instead of undefined 'decoded'
        
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ role: user.role }); // ✅ Return user role (admin/user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

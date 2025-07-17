const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User"); // Import User Model
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT;

// 🔹 Request Password Reset (Sends Email)
router.post(
  "/forget-password",
  [body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate Reset Token (Valid for 1 Hour)
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      // Encode token to safely pass it in URL
      const encodedToken = encodeURIComponent(token);

      // Send reset email (Replace with actual email logic)
      const resetLink = `http://localhost:3000/reset-password/${user._id}/${encodedToken}`;
      console.log("Reset Link:", resetLink);

      res.json({ message: "Check your email for password reset link", resetLink });
    } catch (error) {
      console.error("Error sending reset email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// 🔹 Reset Password
router.post(
  "/reset-password/:id/:token",
  [body("password", "Password must be at least 6 characters").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, token } = req.params;
    const { password } = req.body;

    try {
      // Decode token
      const decodedToken = decodeURIComponent(token);

      // Verify Token
      const decoded = jwt.verify(decodedToken, JWT_SECRET);

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(400).json({ error: "Invalid or expired token" });
    }
  }
);

module.exports = router;

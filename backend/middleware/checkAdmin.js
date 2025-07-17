// middleware/checkAdmin.js
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); // Get user from database
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied, admin only!" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


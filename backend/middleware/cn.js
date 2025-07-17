require("dotenv").config();
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT;

const cn = (req, res, next) => {
    const token = req.header('Authorization'); // ✅ Use 'Authorization' instead of 'auth-token'
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    
    try {
        const decodedToken = token.replace("Bearer ", ""); // ✅ Remove "Bearer " from token before verification
        const data = jwt.verify(decodedToken, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = cn;

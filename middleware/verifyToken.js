const jwt = require('jsonwebtoken');
const cryptoJS = require("crypto-js");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decryptedToken; // Store user info in req.user
        next(); // Proceed to next middleware or route
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;


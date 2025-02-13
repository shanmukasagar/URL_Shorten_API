const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cryptoJS = require("crypto-js");

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.clearCookie('token')
        
        const authToken = jwt.sign( // Generate JWT Token
            { email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        res.cookie("token", authToken, { // Set JWT in HTTP-Only Cookie
            httpOnly: true,
            secure: false,
            sameSite: "Lax", 
            maxAge: 3600000, // 1 hour
        });
  
        res.json({ message: 'Login successful' }); // Respond with success
    });

module.exports = router;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {connectDB, getDB} = require("./db");

// Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: 'http://localhost:5000/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
    
        const user = { // Save user data in session
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Store user email
        };

        // Check user is their in database or not
        await connectDB();
        const db = getDB();
        const usersCollection = await db.collection('Users');

        let checkUser = await usersCollection.findOne({email : user.email});
        if(!checkUser) {
            const result = await usersCollection.insertOne(user);
        }
        return done(null, user); // Pass the user object to the next step
    })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, { email: user.email }));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
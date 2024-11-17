// authRoutes.js

const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();

// Replace with your actual Facebook App ID and Secret from the environment
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// User model for example purposes; replace with your actual database model
const User = {
  findOrCreate: (profile, cb) => {
    // Mock implementation of a user lookup
    const user = { id: profile.id, name: profile.displayName };
    cb(null, user);
  },
  findById: (id, cb) => {
    // Mock implementation of user retrieval by ID
    const user = { id, name: "Sample User" }; // Replace with real user data retrieval
    cb(null, user);
  }
};

// Configure Passport to use Facebook strategy
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email'] 
},
(accessToken, refreshToken, profile, done) => {
  // Find or create user in your database
  User.findOrCreate({ facebookId: profile.id }, (err, user) => {
    return done(err, user);
  });
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Route to initiate Facebook login
router.get('/auth/facebook', passport.authenticate('facebook'));

// Route to handle callback from Facebook
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to your desired route
    res.redirect('/profile');
  }
);

// Protected profile route
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`Welcome ${req.user.name}!`);
});

module.exports = router;

const express = require('express');
const passport = require('passport');
const { signup, login, logout, getCurrentUser } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// ----------------------------------------------------------------------------
// Google OAuth Routes
// ----------------------------------------------------------------------------
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_failed`,
    }),
    (req, res) => {
        // Successful Google auth → redirect to dashboard
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
    }
);

// ----------------------------------------------------------------------------
// Manual (Email/Password) Routes
// ----------------------------------------------------------------------------
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// ----------------------------------------------------------------------------
// Session Routes
// ----------------------------------------------------------------------------
router.post('/logout', logout);
router.get('/current-user', getCurrentUser);

module.exports = router;

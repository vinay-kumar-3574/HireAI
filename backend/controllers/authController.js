const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Controller: signup
 * Handles manual (email/password) signup.
 * - Validates that the email isn't already taken.
 * - Hashes the password with bcrypt.
 * - Creates the user in Firestore.
 * - Logs the user in via Passport session.
 */
const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Split full name into first/last
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Create user in Firestore
        const newUser = await User.create({
            firstName,
            lastName,
            displayName: fullName.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            photoURL: '',
            authProvider: 'local',
        });

        // Remove password from response
        const { password: _, ...safeUser } = newUser;

        // Auto login the user after signup
        req.logIn(safeUser, (err) => {
            if (err) {
                console.error('Session login error after signup:', err);
                return res.status(500).json({ error: 'Account created but auto-login failed.' });
            }
            return res.status(201).json({
                message: 'Account created successfully!',
                user: safeUser,
            });
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
};

/**
 * Controller: login
 * Handles manual (email/password) login.
 * - Finds the user by email.
 * - Compares password with bcrypt.
 * - Logs the user in via Passport session.
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // If the user signed up with Google, they don't have a password
        if (user.authProvider === 'google' && !user.password) {
            return res.status(401).json({
                error: 'This account uses Google login. Please sign in with Google.',
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Remove password from response
        const { password: _, ...safeUser } = user;

        // Establish session
        req.logIn(safeUser, (err) => {
            if (err) {
                console.error('Session login error:', err);
                return res.status(500).json({ error: 'Login failed. Please try again.' });
            }
            return res.status(200).json({
                message: 'Logged in successfully!',
                user: safeUser,
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
};

/**
 * Controller: logout
 * Destroys the Passport session.
 */
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                console.error('Session destroy error:', sessionErr);
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully.' });
        });
    });
};

/**
 * Controller: getCurrentUser
 * Returns the currently authenticated user from session.
 */
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ user: req.user });
    }
    return res.status(401).json({ error: 'Not authenticated.' });
};

module.exports = { signup, login, logout, getCurrentUser };

/**
 * Middleware: isAuthenticated
 * Checks if the user is authenticated (has a valid session).
 * Used to protect routes that require login.
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

module.exports = { isAuthenticated };

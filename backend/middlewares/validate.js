/**
 * Middleware: validateSignup
 * Validates signup request body fields.
 */
const validateSignup = (req, res, next) => {
    const { fullName, email, password } = req.body;

    const errors = [];

    if (!fullName || fullName.trim().length < 2) {
        errors.push('Full name is required and must be at least 2 characters.');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('A valid email address is required.');
    }

    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

/**
 * Middleware: validateLogin
 * Validates login request body fields.
 */
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('A valid email address is required.');
    }

    if (!password || password.length < 1) {
        errors.push('Password is required.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = { validateSignup, validateLogin };

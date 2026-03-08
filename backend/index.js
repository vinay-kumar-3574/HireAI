const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Initialize Firebase
require('./config/firebase');

// Initialize Passport Strategies
require('./config/passport');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const extensionRoutes = require('./routes/extension');

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'chrome-extension://', // Allow any Chrome extension
        ];
        // Allow requests with no origin (e.g., Chrome extensions, mobile apps)
        if (!origin) return callback(null, true);
        // Check if origin is allowed or is a Chrome extension
        if (allowedOrigins.some(allowed => origin.startsWith(allowed)) || origin.startsWith('chrome-extension://')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretcode',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/extension', extensionRoutes);

app.get('/', (req, res) => {
    res.send('API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

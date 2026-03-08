const express = require('express');
const { tailorResume, generateCoverLetter, saveJob } = require('../controllers/extensionController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// All extension routes require authentication
router.use(isAuthenticated);

// Tailor resume against a job description
router.post('/tailor-resume', tailorResume);

// Generate a cover letter
router.post('/generate-cover-letter', generateCoverLetter);

// Save a job application
router.post('/save-job', saveJob);

module.exports = router;

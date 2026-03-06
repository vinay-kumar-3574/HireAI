const express = require('express');
const { uploadResume, getResumes, getResumeById, deleteResume, downloadResume } = require('../controllers/resumeController');
const { isAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// All resume routes require authentication
router.use(isAuthenticated);

// Upload a resume (PDF or DOCX)
router.post('/upload', upload.single('resumeFile'), uploadResume);

// Get all resumes for the logged-in user
router.get('/', getResumes);

// Get a single resume by ID
router.get('/:id', getResumeById);

// Delete a resume by ID
router.delete('/:id', deleteResume);

// Download/preview a resume file by ID
router.get('/:id/download', downloadResume);

module.exports = router;

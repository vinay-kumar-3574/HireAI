const path = require('path');
const mammoth = require('mammoth');
const Resume = require('../models/Resume');

/**
 * Helper: Extract text from uploaded file buffer
 * NOTE: PDF text extraction will be implemented in a future session.
 */
async function extractText(buffer, originalName) {
    const ext = path.extname(originalName).toLowerCase();

    if (ext === '.pdf') {
        // TODO: Implement PDF text extraction in next session
        return '';
    }

    if (ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
}

/**
 * Controller: uploadResume
 * Handles resume file upload, extracts text, and stores in Firestore.
 */
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const { resumeName } = req.body;
        if (!resumeName || resumeName.trim().length < 1) {
            return res.status(400).json({ error: 'Resume name is required.' });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Extract text content from the uploaded file
        const extractedText = await extractText(req.file.buffer, req.file.originalname);

        // Save resume metadata + file data to Firestore
        const resume = await Resume.create({
            userId,
            resumeName: resumeName.trim(),
            fileName: req.file.originalname,
            fileType: path.extname(req.file.originalname).toLowerCase().replace('.', ''),
            fileSize: req.file.size,
            fileData: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype,
            extractedText,
            status: 'processed',
        });

        return res.status(201).json({
            message: 'Resume uploaded and processed successfully!',
            resume,
        });
    } catch (error) {
        console.error('Resume upload error:', error);

        if (error.message && error.message.includes('Only PDF and DOCX')) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Failed to process the resume. Please try again.' });
    }
};

/**
 * Controller: getResumes
 * Returns all resumes for the currently logged-in user.
 */
const getResumes = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const resumes = await Resume.findByUserId(userId);

        return res.status(200).json({ resumes });
    } catch (error) {
        console.error('Get resumes error:', error);
        return res.status(500).json({ error: 'Failed to fetch resumes.' });
    }
};

/**
 * Controller: getResumeById
 * Returns a single resume by ID (only if it belongs to the user).
 */
const getResumeById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        if (resume.userId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        return res.status(200).json({ resume });
    } catch (error) {
        console.error('Get resume error:', error);
        return res.status(500).json({ error: 'Failed to fetch resume.' });
    }
};

/**
 * Controller: deleteResume
 * Deletes a resume by ID (only if it belongs to the user).
 */
const deleteResume = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        if (resume.userId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        await Resume.deleteById(id);

        return res.status(200).json({ message: 'Resume deleted successfully.' });
    } catch (error) {
        console.error('Delete resume error:', error);
        return res.status(500).json({ error: 'Failed to delete resume.' });
    }
};

/**
 * Controller: downloadResume
 * Serves the original file for preview/download (only if it belongs to the user).
 */
const downloadResume = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        if (resume.userId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        if (!resume.fileData) {
            return res.status(404).json({ error: 'File data not available.' });
        }

        const fileBuffer = Buffer.from(resume.fileData, 'base64');
        const mimeType = resume.mimeType || (resume.fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        res.set({
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${resume.fileName}"`,
            'Content-Length': fileBuffer.length,
        });

        return res.send(fileBuffer);
    } catch (error) {
        console.error('Download resume error:', error);
        return res.status(500).json({ error: 'Failed to download resume.' });
    }
};

module.exports = { uploadResume, getResumes, getResumeById, deleteResume, downloadResume };

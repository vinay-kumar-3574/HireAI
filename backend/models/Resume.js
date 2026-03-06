const { db } = require('../config/firebase');

const RESUMES_COLLECTION = 'resumes';

/**
 * Resume Model - Handles all Firestore CRUD operations for the 'resumes' collection.
 */
const Resume = {
    /**
     * Create a new resume document.
     * @param {Object} resumeData - The resume data to store.
     * @returns {Object} The created resume with id.
     */
    async create(resumeData) {
        const data = {
            ...resumeData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const ref = await db.collection(RESUMES_COLLECTION).add(data);
        return { id: ref.id, ...data };
    },

    /**
     * Find a resume by its Firestore document ID.
     * @param {string} id - The Firestore document ID.
     * @returns {Object|null} The resume or null.
     */
    async findById(id) {
        const doc = await db.collection(RESUMES_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    /**
     * Find all resumes for a given user.
     * @param {string} userId - The user's Firestore document ID.
     * @returns {Array} List of resume objects.
     */
    async findByUserId(userId) {
        const snapshot = await db
            .collection(RESUMES_COLLECTION)
            .where('userId', '==', userId)
            .get();

        const resumes = [];
        snapshot.forEach((doc) => {
            resumes.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt descending (newest first) in JS
        resumes.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        return resumes;
    },

    /**
     * Update a resume by document ID.
     * @param {string} id - The Firestore document ID.
     * @param {Object} updateData - Fields to update.
     * @returns {Object} The updated resume.
     */
    async updateById(id, updateData) {
        const ref = db.collection(RESUMES_COLLECTION).doc(id);
        await ref.update({
            ...updateData,
            updatedAt: new Date().toISOString(),
        });
        const updated = await ref.get();
        return { id: updated.id, ...updated.data() };
    },

    /**
     * Delete a resume by document ID.
     * @param {string} id - The Firestore document ID.
     */
    async deleteById(id) {
        await db.collection(RESUMES_COLLECTION).doc(id).delete();
    },
};

module.exports = Resume;

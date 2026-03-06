const { db } = require('../config/firebase');

const USERS_COLLECTION = 'users';

/**
 * User Model - Handles all Firestore CRUD operations for the 'users' collection.
 */
const User = {
    /**
     * Create a new user document in Firestore.
     * @param {Object} userData - The user data to store.
     * @param {string|null} docId - Optional custom document ID (e.g., Firebase Auth UID).
     * @returns {Object} The created user with id.
     */
    async create(userData, docId = null) {
        const data = {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        let ref;
        if (docId) {
            ref = db.collection(USERS_COLLECTION).doc(docId);
            await ref.set(data);
        } else {
            ref = await db.collection(USERS_COLLECTION).add(data);
        }

        return { id: ref.id, ...data };
    },

    /**
     * Find a user by their Firestore document ID.
     * @param {string} id - The Firestore document ID.
     * @returns {Object|null} The user object or null.
     */
    async findById(id) {
        const doc = await db.collection(USERS_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    /**
     * Find a user by email.
     * @param {string} email - The user's email.
     * @returns {Object|null} The user object or null.
     */
    async findByEmail(email) {
        const snapshot = await db
            .collection(USERS_COLLECTION)
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        let user = null;
        snapshot.forEach((doc) => {
            user = { id: doc.id, ...doc.data() };
        });
        return user;
    },

    /**
     * Find a user by Google ID.
     * @param {string} googleId - The Google profile ID.
     * @returns {Object|null} The user object or null.
     */
    async findByGoogleId(googleId) {
        const snapshot = await db
            .collection(USERS_COLLECTION)
            .where('googleId', '==', googleId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        let user = null;
        snapshot.forEach((doc) => {
            user = { id: doc.id, ...doc.data() };
        });
        return user;
    },

    /**
     * Update a user by document ID.
     * @param {string} id - The Firestore document ID.
     * @param {Object} updateData - Fields to update.
     * @returns {Object} The updated user.
     */
    async updateById(id, updateData) {
        const ref = db.collection(USERS_COLLECTION).doc(id);
        await ref.update({
            ...updateData,
            updatedAt: new Date().toISOString(),
        });
        const updated = await ref.get();
        return { id: updated.id, ...updated.data() };
    },

    /**
     * Delete a user by document ID.
     * @param {string} id - The Firestore document ID.
     */
    async deleteById(id) {
        await db.collection(USERS_COLLECTION).doc(id).delete();
    },
};

module.exports = User;

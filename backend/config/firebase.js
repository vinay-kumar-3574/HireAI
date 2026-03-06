const admin = require('firebase-admin');
const path = require('path');

try {
    const serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account.json'));

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin initialized successfully.");
} catch (error) {
    console.error("❌ Firebase Admin initialization error:", error.message);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

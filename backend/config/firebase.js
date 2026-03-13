const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// Standard Firebase Admin initialization using env vars
// In a real production app, private key newlines from .env need to be handled
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  try {
    // Basic check to see if dummy keys are still in place
    if (!privateKey || privateKey.includes('YourKeyHere')) {
      console.warn('⚠️ Firebase Admin SDK not initialized: Please provide a valid FIREBASE_PRIVATE_KEY in backend/.env');
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin initialized successfully.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Try to export db and auth safely
let db = null;
let auth = null;

try {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    auth = admin.auth();
  }
} catch (e) {
  console.warn('Firestore/Auth disabled until credentials are provided.');
}

module.exports = { admin, db, auth };

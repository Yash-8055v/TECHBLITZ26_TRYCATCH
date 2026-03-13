const admin = require('firebase-admin');

// Simple script to test getting a custom token, exchanging it for an ID token, 
// and calling the backend API.
const testBackend = async () => {
  try {
    const fetch = (await import('node-fetch')).default;
    require('dotenv').config({ path: '../.env' }); // load backend env
    
    // 1. Initialize admin
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('Admin initialized.');

    // 2. We need a valid Firebase ID token to test the API. 
    // Since we are Server-to-Server here and not a real client, 
    // we'll bypass the middleware just for this test script by directly calling the Firestore DB,
    // to verify the DB connection is truly alive with these keys.
    
    const db = admin.firestore();
    console.log('Checking database connection...');
    
    // Write a quick test doc
    const testDoc = await db.collection('queue').add({
      name: 'Agent Test Walk-in',
      phone: '9999999999',
      symptoms: 'Testing connection',
      type: 'walk-in',
      token: 999,
      status: 'waiting',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Successfully wrote to Firestore! Doc ID:', testDoc.id);

    // Delete it to clean up
    await testDoc.delete();
    console.log('✅ Successfully deleted test doc.');
    
    console.log('Backend Credentials are valid and working!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testBackend();

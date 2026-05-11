const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'hasagoldstore',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@hasagoldstore.iam.gserviceaccount.com',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || 'hasagoldstore'}.firebaseio.com`
  });
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { adminToken } = req.body;

  if (!adminToken) {
    return res.status(400).json({ error: 'adminToken is required' });
  }

  try {
    // 1. Find the token in Firestore
    const tokenQuery = await db.collection('admin_auth_tokens')
      .where('token', '==', adminToken)
      .limit(1)
      .get();

    if (tokenQuery.empty) {
      return res.status(401).json({ error: 'Invalid or expired magic link token.' });
    }

    const tokenDoc = tokenQuery.docs[0];
    const data = tokenDoc.data();

    // 2. Check expiration (15 minutes)
    const now = Date.now();
    const expiresAt = data.expiresAt.toDate().getTime();

    if (now > expiresAt) {
      await tokenDoc.ref.delete();
      return res.status(401).json({ error: 'Magic link has expired.' });
    }

    // 3. Generate Custom Token for Firebase Auth
    // 4. Create a Firebase Custom Token with explicit email claim
    // This is CRITICAL for Firestore security rules to recognize the user
    const customToken = await admin.auth().createCustomToken(data.email, {
      email: data.email,
      admin: true
    });

    // 4. Delete the used token
    await tokenDoc.ref.delete();

    // 5. Return the custom token
    return res.status(200).json({
      success: true,
      customToken,
      email: data.email
    });

  } catch (error) {
    console.error('❌ verify-admin error:', error.message);
    return res.status(500).json({ error: 'Verification failed: ' + error.message });
  }
};

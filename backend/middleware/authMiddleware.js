const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token passed in the Authorization header.
 * Expects header format: `Bearer <token>`
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!auth) {
    return res.status(500).json({ error: 'Server not configured with Firebase Admin credentials yet.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Attach user info (uid, email, etc.) to request
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = { verifyToken };

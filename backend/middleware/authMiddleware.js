const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const readData = () => JSON.parse(fs.readFileSync(dbPath));

// Middleware to protect routes - now handles Firebase user IDs
function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    // Check if token exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authorization error: Invalid token format.' });
    }
    
    try {
        // Get Firebase user ID from header (e.g., "Bearer <firebase-uid>")
        const firebaseUid = authHeader.split(' ')[1];

        if (!firebaseUid) {
            return res.status(401).json({ msg: 'No user ID provided' });
        }

        // Add user ID to the request object
        req.user = { id: firebaseUid };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Authentication failed' });
    }
}

// Middleware for admin-only routes
function admin(req, res, next) {
    const data = readData();
    const user = data.users.find(u => u.id === req.user.id);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
}

module.exports = { auth, admin };

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../db.json');
const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Get user profile - now works with Firebase user IDs
const getProfile = (req, res) => {
    const firebaseUid = req.user.id;
    const data = readData();
    
    // Try to find user in local database first
    let user = data.users.find(u => u.id === firebaseUid);
    
    if (!user) {
        // If user not found in local DB, return basic info from request
        // This handles cases where user exists in Firebase but not in local DB
        return res.json({ 
            id: firebaseUid, 
            name: req.body.name || 'User', 
            email: req.body.email || '', 
            isAdmin: false 
        });
    }
    
    res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
};

// Update user profile - now works with Firebase user IDs
const updateProfile = (req, res) => {
    const firebaseUid = req.user.id;
    const { name, email, password } = req.body;
    const data = readData();
    
    // Find or create user in local database
    let user = data.users.find(u => u.id === firebaseUid);
    
    if (!user) {
        // Create new user entry in local DB
        user = {
            id: firebaseUid,
            name: name || 'User',
            email: email || '',
            password: password ? bcrypt.hashSync(password, 10) : '',
            isAdmin: false
        };
        data.users.push(user);
    } else {
        // Update existing user
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(password, salt);
        }
    }
    
    writeData(data);
    res.json({ 
        msg: 'Profile updated', 
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
    });
};

// Admin: get all users
const getAllUsers = (req, res) => {
    const data = readData();
    res.json(data.users.map(u => ({ id: u.id, name: u.name, email: u.email, isAdmin: u.isAdmin })));
};

// Admin: delete user
const deleteUser = (req, res) => {
    const { userId } = req.params;
    const data = readData();
    const idx = data.users.findIndex(u => u.id === userId);
    if (idx === -1) return res.status(404).json({ msg: 'User not found' });
    data.users.splice(idx, 1);
    writeData(data);
    res.json({ msg: 'User deleted' });
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser };

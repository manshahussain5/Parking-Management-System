const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db.json');
const JWT_SECRET = 'supersecretkey'; // In production, use env vars

const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    let data = readData();
    if (data.users.find(u => u.email === email)) {
        return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hash,
        isAdmin: false
    };
    data.users.push(newUser);
    writeData(data);
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: 3600 });
    res.json({ token, user: { id: newUser.id, name, email, isAdmin: newUser.isAdmin } });
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    const data = readData();
    const user = data.users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
};

module.exports = { registerUser, loginUser };

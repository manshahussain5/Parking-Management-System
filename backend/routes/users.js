const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/userController');

// @route   GET api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   POST api/users/profile
// @desc    Get current user's profile (with user data in body)
// @access  Private
router.post('/profile', auth, getProfile);

// @route   PUT api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET api/users/all
// @desc    Admin: Get all users
// @access  Admin
router.get('/all', auth, admin, getAllUsers);

// @route   DELETE api/users/:userId
// @desc    Admin: Delete a user
// @access  Admin
router.delete('/:userId', auth, admin, deleteUser);

module.exports = router;

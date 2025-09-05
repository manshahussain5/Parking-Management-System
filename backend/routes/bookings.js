const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { auth, admin } = require('../middleware/authMiddleware');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, createBooking);

// @route   GET api/bookings/user/:userId
// @desc    Get user's bookings
// @access  Private
router.get('/user/:userId', auth, getUserBookings);

// @route   DELETE api/bookings/:bookingId
// @desc    Cancel a booking
// @access  Private
router.delete('/:bookingId', auth, cancelBooking);

// @route   GET api/bookings/all
// @desc    Admin: Get all bookings
// @access  Admin
router.get('/all', auth, admin, getAllBookings);

module.exports = router;

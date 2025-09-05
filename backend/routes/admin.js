const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const { getDashboardStats, getAllUsers, getAllBookings, deleteUser, updateUser, cancelBooking, getAllLots, addLot, updateLot, deleteLot, addSlot, updateSlot, deleteSlot } = require('../controllers/adminController');

// Dashboard Stats
router.get('/stats', auth, admin, getDashboardStats);

// Parking lot CRUD
router.get('/lots', auth, admin, getAllLots);
router.post('/lots', auth, admin, addLot);
router.put('/lots/:lotId', auth, admin, updateLot);
router.delete('/lots/:lotId', auth, admin, deleteLot);

// Slot CRUD
router.post('/lots/:lotId/slots', auth, admin, addSlot);
router.put('/lots/:lotId/slots/:slotId', auth, admin, updateSlot);
router.delete('/lots/:lotId/slots/:slotId', auth, admin, deleteSlot);

// User and Booking Management
router.get('/users', auth, admin, getAllUsers);
router.delete('/users/:id', auth, admin, deleteUser);
router.put('/users/:id', auth, admin, updateUser);
router.get('/bookings', auth, admin, getAllBookings);
router.delete('/bookings/:id', auth, admin, cancelBooking);

module.exports = router;

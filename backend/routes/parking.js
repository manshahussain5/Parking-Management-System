const express = require('express');
const router = express.Router();
const { getParkingLots } = require('../controllers/parkingController');

// @route   GET api/parking/lots
// @desc    Get all parking lots
// @access  Public
router.get('/lots', getParkingLots);

// A placeholder for a future route
const getSlots = (req, res) => res.json({ msg: `Get slots for lot ${req.params.lotId}` });

// @route   GET api/parking/lots/:lotId/slots
// @desc    Get available slots for a lot
// @access  Public
router.get('/lots/:lotId/slots', getSlots);


module.exports = router;

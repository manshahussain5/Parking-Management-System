const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db.json');

const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Create a new booking
const createBooking = (req, res) => {
    const { userId, lotId, slotId, date, time } = req.body;
    if (!userId || !lotId || !slotId || !date || !time) {
        return res.status(400).json({ msg: 'Missing booking details' });
    }
    const data = readData();
    // Check slot availability
    const lot = data.parkingLots.find(l => l.id === lotId);
    if (!lot) return res.status(404).json({ msg: 'Lot not found' });
    const slot = lot.slots.find(s => s.id === slotId);
    if (!slot || !slot.isAvailable) return res.status(400).json({ msg: 'Slot not available' });
    // Mark slot as unavailable
    slot.isAvailable = false;
    // Create booking
    const booking = {
        id: uuidv4(),
        userId,
        lotId,
        slotId,
        date,
        time,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    data.bookings.push(booking);
    writeData(data);
    res.json({ msg: 'Booking successful', booking });
};

// Get bookings for a user
const getUserBookings = (req, res) => {
    const { userId } = req.params;
    const data = readData();
    const bookings = data.bookings.filter(b => b.userId === userId);
    res.json(bookings);
};

// Cancel a booking
const cancelBooking = (req, res) => {
    const { bookingId } = req.params;
    const data = readData();
    const booking = data.bookings.find(b => b.id === bookingId);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.status !== 'active') {
        return res.status(400).json({ msg: 'Booking already cancelled or completed' });
    }
    // Mark slot as available again
    const lot = data.parkingLots.find(l => l.id === booking.lotId);
    if (lot) {
        const slot = lot.slots.find(s => s.id === booking.slotId);
        if (slot) slot.isAvailable = true;
    }
    booking.status = 'cancelled';
    writeData(data);
    res.json({ msg: 'Booking cancelled', booking });
};

// Admin: get all bookings
const getAllBookings = (req, res) => {
    const data = readData();
    res.json(data.bookings);
};

module.exports = { createBooking, getUserBookings, cancelBooking, getAllBookings };

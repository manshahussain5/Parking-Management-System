const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db.json');
const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
const getAllUsers = (req, res) => {
    try {
        const data = readData();
        // Exclude passwords from the response for security
        const users = data.users.map(({ password, ...user }) => user);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/bookings
// @desc    Get all bookings
// @access  Private/Admin
// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
const deleteUser = (req, res) => {
    try {
        let data = readData();
        const userIndex = data.users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            return res.status(404).json({ msg: 'User not found' });
        }

        data.users.splice(userIndex, 1);
        writeData(data);

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isAdmin } = req.body;

        let data = readData();
        const userIndex = data.users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const user = data.users[userIndex];

        // Update fields if they are provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (typeof isAdmin === 'boolean') {
            user.isAdmin = isAdmin;
        }

        writeData(data);

        // Return updated user without password
        const { password, ...updatedUser } = user;
        res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/admin/bookings/:id
// @desc    Admin cancel a booking
// @access  Private/Admin
const cancelBooking = (req, res) => {
    try {
        let data = readData();
        const bookingIndex = data.bookings.findIndex(b => b.id === req.params.id);

        if (bookingIndex === -1) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        const booking = data.bookings[bookingIndex];

        if (booking.status === 'cancelled') {
            return res.status(400).json({ msg: 'Booking is already cancelled' });
        }

        // Update booking status
        booking.status = 'cancelled';

        // Make the slot available again
        const lot = data.parkingLots.find(l => l.id === booking.lotId);
        if (lot) {
            const slot = lot.slots.find(s => s.id === booking.slotId);
            if (slot) {
                slot.isAvailable = true;
            }
        }

        writeData(data);

        res.json({ msg: 'Booking cancelled successfully', booking });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/lots
// @desc    Get all parking lots
// @access  Private/Admin
const getAllLots = (req, res) => {
    try {
        const data = readData();
        res.json(data.parkingLots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAllBookings = (req, res) => {
    try {
        const data = readData();
        res.json(data.bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// CRUD for parking lots
// @route   POST api/admin/lots
// @desc    Add a new parking lot
// @access  Private/Admin
const addLot = (req, res) => {
    const { name, location, numberOfSlots } = req.body;
    if (!name || !location || !numberOfSlots) {
        return res.status(400).json({ msg: 'Please provide name, location, and number of slots' });
    }

    const slotsCount = parseInt(numberOfSlots, 10);
    if (isNaN(slotsCount) || slotsCount <= 0 || slotsCount > 500) { // Basic validation
        return res.status(400).json({ msg: 'Number of slots must be a positive number up to 500.' });
    }

    try {
        let data = readData();
        const newLot = {
            id: `lot_${new Date().getTime()}`,
            name,
            location,
            slots: []
        };

        for (let i = 1; i <= slotsCount; i++) {
            newLot.slots.push({
                id: `slot_${newLot.id}_${i}`,
                name: `S${i}`,
                isAvailable: true
            });
        }

        data.parkingLots.push(newLot);
        writeData(data);
        res.status(201).json(newLot);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateLot = (req, res) => {
    const { lotId } = req.params;
    const { name, location } = req.body;
    const data = readData();
    const lot = data.parkingLots.find(l => l.id === lotId);
    if (!lot) return res.status(404).json({ msg: 'Lot not found' });
    if (name) lot.name = name;
    if (location) lot.location = location;
    writeData(data);
    res.json({ msg: 'Lot updated', lot });
};
const deleteLot = (req, res) => {
    const { lotId } = req.params;
    const data = readData();
    const idx = data.parkingLots.findIndex(l => l.id === lotId);
    if (idx === -1) return res.status(404).json({ msg: 'Lot not found' });
    data.parkingLots.splice(idx, 1);
    writeData(data);
    res.json({ msg: 'Lot deleted' });
};

// CRUD for slots
const addSlot = (req, res) => {
    const { lotId } = req.params;
    const { slotId } = req.body;
    const data = readData();
    const lot = data.parkingLots.find(l => l.id === lotId);
    if (!lot) return res.status(404).json({ msg: 'Lot not found' });
    if (lot.slots.find(s => s.id === slotId)) return res.status(400).json({ msg: 'Slot already exists' });
    lot.slots.push({ id: slotId, isAvailable: true });
    writeData(data);
    res.json({ msg: 'Slot added', slots: lot.slots });
};
const updateSlot = (req, res) => {
    const { lotId, slotId } = req.params;
    const { isAvailable } = req.body;
    const data = readData();
    const lot = data.parkingLots.find(l => l.id === lotId);
    if (!lot) return res.status(404).json({ msg: 'Lot not found' });
    const slot = lot.slots.find(s => s.id === slotId);
    if (!slot) return res.status(404).json({ msg: 'Slot not found' });
    if (typeof isAvailable === 'boolean') slot.isAvailable = isAvailable;
    writeData(data);
    res.json({ msg: 'Slot updated', slot });
};
const deleteSlot = (req, res) => {
    const { lotId, slotId } = req.params;
    const data = readData();
    const lot = data.parkingLots.find(l => l.id === lotId);
    if (!lot) return res.status(404).json({ msg: 'Lot not found' });
    const idx = lot.slots.findIndex(s => s.id === slotId);
    if (idx === -1) return res.status(404).json({ msg: 'Slot not found' });
    lot.slots.splice(idx, 1);
    writeData(data);
    res.json({ msg: 'Slot deleted', slots: lot.slots });
};

// @desc    Get dashboard statistics
// @route   GET api/admin/stats
// @access  Private/Admin
const getDashboardStats = (req, res) => {
    try {
        const data = readData();
        const totalUsers = data.users.length;
        const totalLots = data.parkingLots.length;
        const totalBookings = data.bookings.length;
        const activeBookings = data.bookings.filter(b => b.status === 'active').length;

        res.json({
            totalUsers,
            totalLots,
            totalBookings,
            activeBookings
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, updateUser, getAllBookings, cancelBooking, getAllLots, addLot, updateLot, deleteLot, addSlot, updateSlot, deleteSlot };

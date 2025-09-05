const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const readData = () => {
    const rawData = fs.readFileSync(dbPath);
    return JSON.parse(rawData);
};

// @desc    Get all parking lots
// @route   GET /api/parking/lots
// @access  Public
const getParkingLots = (req, res) => {
    try {
        const data = readData();
        res.json(data.parkingLots);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getParkingLots,
};

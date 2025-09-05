// Temporary JavaScript Database Service
// This replaces Firebase with in-memory storage for development/testing

class TempDatabase {
    constructor() {
        this.data = {
            users: [],
            parkingLots: [],
            bookings: [],
            adminUsers: []
        };
        this.initializeData();
    }

    // Initialize with sample data
    initializeData() {
        // Sample parking lots
        this.data.parkingLots = [
            {
                id: 'lot1',
                name: "Central Parking Lot",
                location: "Downtown Area",
                slots: [
                    { id: "A1", name: "A1", isAvailable: true },
                    { id: "A2", name: "A2", isAvailable: true },
                    { id: "A3", name: "A3", isAvailable: true },
                    { id: "A4", name: "A4", isAvailable: true },
                    { id: "A5", name: "A5", isAvailable: true },
                    { id: "B1", name: "B1", isAvailable: true },
                    { id: "B2", name: "B2", isAvailable: true },
                    { id: "B3", name: "B3", isAvailable: true },
                    { id: "B4", name: "B4", isAvailable: true },
                    { id: "B5", name: "B5", isAvailable: true }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 'lot2',
                name: "Mall Parking",
                location: "Shopping Mall",
                slots: [
                    { id: "M1", name: "M1", isAvailable: true },
                    { id: "M2", name: "M2", isAvailable: true },
                    { id: "M3", name: "M3", isAvailable: true },
                    { id: "M4", name: "M4", isAvailable: true },
                    { id: "M5", name: "M5", isAvailable: true },
                    { id: "M6", name: "M6", isAvailable: true },
                    { id: "M7", name: "M7", isAvailable: true },
                    { id: "M8", name: "M8", isAvailable: true }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 'lot3',
                name: "Airport Parking",
                location: "International Airport",
                slots: [
                    { id: "AP1", name: "AP1", isAvailable: true },
                    { id: "AP2", name: "AP2", isAvailable: true },
                    { id: "AP3", name: "AP3", isAvailable: true },
                    { id: "AP4", name: "AP4", isAvailable: true },
                    { id: "AP5", name: "AP5", isAvailable: true },
                    { id: "AP6", name: "AP6", isAvailable: true },
                    { id: "AP7", name: "AP7", isAvailable: true },
                    { id: "AP8", name: "AP8", isAvailable: true },
                    { id: "AP9", name: "AP9", isAvailable: true },
                    { id: "AP10", name: "AP10", isAvailable: true }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        // Sample admin user
        this.data.adminUsers = [
            {
                id: 'admin1',
                email: 'admin@parking.com',
                password: 'admin123', // In real app, this would be hashed
                isAdmin: true,
                role: 'administrator',
                createdAt: new Date().toISOString()
            }
        ];

        // Load data from localStorage if available
        this.loadFromStorage();
    }

    // Save data to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('tempDatabase', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Load data from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('tempDatabase');
            if (saved) {
                this.data = { ...this.data, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // User operations
    async createUser(userData) {
        const user = {
            id: this.generateId(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.data.users.push(user);
        this.saveToStorage();
        return user;
    }

    async getUserByEmail(email) {
        return this.data.users.find(user => user.email === email) || null;
    }

    async getUserById(id) {
        return this.data.users.find(user => user.id === id) || null;
    }

    async updateUser(id, updates) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.data.users[index] = { ...this.data.users[index], ...updates };
            this.saveToStorage();
            return this.data.users[index];
        }
        return null;
    }

    async deleteUser(id) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index !== -1) {
            const user = this.data.users.splice(index, 1)[0];
            this.saveToStorage();
            return user;
        }
        return null;
    }

    async getAllUsers() {
        return [...this.data.users];
    }

    // Admin operations
    async createAdmin(adminData) {
        const admin = {
            id: this.generateId(),
            ...adminData,
            isAdmin: true,
            role: 'administrator',
            createdAt: new Date().toISOString()
        };
        this.data.adminUsers.push(admin);
        this.saveToStorage();
        return admin;
    }

    async getAdminByEmail(email) {
        return this.data.adminUsers.find(admin => admin.email === email) || null;
    }

    async makeUserAdmin(userId) {
        const user = await this.getUserById(userId);
        if (user) {
            user.isAdmin = true;
            user.role = 'administrator';
            this.saveToStorage();
            return user;
        }
        return null;
    }

    async checkIfUserIsAdmin(userId) {
        const user = await this.getUserById(userId);
        return user ? user.isAdmin === true : false;
    }

    // Parking lot operations
    async getParkingLots() {
        return [...this.data.parkingLots];
    }

    async getParkingLotById(id) {
        return this.data.parkingLots.find(lot => lot.id === id) || null;
    }

    async createParkingLot(lotData) {
        const lot = {
            id: this.generateId(),
            ...lotData,
            createdAt: new Date().toISOString()
        };
        this.data.parkingLots.push(lot);
        this.saveToStorage();
        return lot;
    }

    async updateParkingLot(id, updates) {
        const index = this.data.parkingLots.findIndex(lot => lot.id === id);
        if (index !== -1) {
            this.data.parkingLots[index] = { ...this.data.parkingLots[index], ...updates };
            this.saveToStorage();
            return this.data.parkingLots[index];
        }
        return null;
    }

    async deleteParkingLot(id) {
        const index = this.data.parkingLots.findIndex(lot => lot.id === id);
        if (index !== -1) {
            const lot = this.data.parkingLots.splice(index, 1)[0];
            this.saveToStorage();
            return lot;
        }
        return null;
    }

    async updateSlotAvailability(lotId, slotId, isAvailable) {
        const lot = await this.getParkingLotById(lotId);
        if (lot) {
            const slotIndex = lot.slots.findIndex(slot => slot.id === slotId);
            if (slotIndex !== -1) {
                lot.slots[slotIndex].isAvailable = isAvailable;
                await this.updateParkingLot(lotId, { slots: lot.slots });
                return true;
            }
        }
        return false;
    }

    // Booking operations
    async createBooking(bookingData) {
        const booking = {
            id: this.generateId(),
            ...bookingData,
            createdAt: new Date().toISOString()
        };
        this.data.bookings.push(booking);
        this.saveToStorage();
        return booking;
    }

    async getBookingsByUserId(userId) {
        return this.data.bookings.filter(booking => booking.userId === userId);
    }

    async getAllBookings() {
        return [...this.data.bookings];
    }

    async updateBooking(id, updates) {
        const index = this.data.bookings.findIndex(booking => booking.id === id);
        if (index !== -1) {
            this.data.bookings[index] = { ...this.data.bookings[index], ...updates };
            this.saveToStorage();
            return this.data.bookings[index];
        }
        return null;
    }

    async deleteBooking(id) {
        const index = this.data.bookings.findIndex(booking => booking.id === id);
        if (index !== -1) {
            const booking = this.data.bookings.splice(index, 1)[0];
            this.saveToStorage();
            return booking;
        }
        return null;
    }

    // Clear all data (for testing)
    clearAllData() {
        this.data = {
            users: [],
            parkingLots: [],
            bookings: [],
            adminUsers: []
        };
        localStorage.removeItem('tempDatabase');
        this.initializeData();
    }
}

// Create singleton instance
const database = new TempDatabase();

export default database;

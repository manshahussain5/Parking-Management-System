// Authentication Service - replaces Firebase Auth
import database from './database';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Load current user from localStorage
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading current user:', error);
            this.currentUser = null;
        }
    }

    // Save current user to localStorage
    saveCurrentUser(user) {
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    // Clear current user
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        this.currentUser = null;
    }

    // User registration
    async register(email, password, name) {
        try {
            // Check if user already exists
            const existingUser = await database.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const user = await database.createUser({
                email,
                password, // In real app, this would be hashed
                name,
                isAdmin: false,
                role: 'user'
            });

            // Auto-login after registration
            this.saveCurrentUser(user);
            localStorage.setItem('token', user.id);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);

            return { user, success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { error: error.message, success: false };
        }
    }

    // User login
    async login(email, password) {
        try {
            const user = await database.getUserByEmail(email);
            if (!user || user.password !== password) {
                throw new Error('Invalid email or password');
            }

            this.saveCurrentUser(user);
            localStorage.setItem('token', user.id);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);

            return { user, success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { error: error.message, success: false };
        }
    }

    // Admin registration
    async registerAdmin(email, password, name) {
        try {
            // Check if admin already exists
            const existingAdmin = await database.getAdminByEmail(email);
            if (existingAdmin) {
                throw new Error('Admin with this email already exists');
            }

            // Create new admin
            const admin = await database.createAdmin({
                email,
                password, // In real app, this would be hashed
                name
            });

            // Auto-login after registration
            this.saveCurrentUser(admin);
            localStorage.setItem('token', admin.id);
            localStorage.setItem('userEmail', admin.email);
            localStorage.setItem('userName', admin.name);

            return { user: admin, success: true };
        } catch (error) {
            console.error('Admin registration error:', error);
            return { error: error.message, success: false };
        }
    }

    // Admin login
    async loginAdmin(email, password) {
        try {
            const admin = await database.getAdminByEmail(email);
            if (!admin || admin.password !== password) {
                throw new Error('Invalid admin credentials');
            }

            this.saveCurrentUser(admin);
            localStorage.setItem('token', admin.id);
            localStorage.setItem('userEmail', admin.email);
            localStorage.setItem('userName', admin.name);

            return { user: admin, success: true };
        } catch (error) {
            console.error('Admin login error:', error);
            return { error: error.message, success: false };
        }
    }

    // Logout
    async logout() {
        this.clearCurrentUser();
        return { success: true };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if current user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin === true;
    }

    // Get user ID
    getUserId() {
        return this.currentUser ? this.currentUser.id : null;
    }

    // Get user email
    getUserEmail() {
        return this.currentUser ? this.currentUser.email : null;
    }

    // Get user name
    getUserName() {
        return this.currentUser ? this.currentUser.name : null;
    }

    // Make user admin (for testing purposes)
    async makeUserAdmin(userId) {
        try {
            const user = await database.makeUserAdmin(userId);
            if (user) {
                // Update current user if it's the same user
                if (this.currentUser && this.currentUser.id === userId) {
                    this.currentUser = user;
                    this.saveCurrentUser(user);
                }
                return { success: true, user };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            console.error('Error making user admin:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user is admin by ID
    async checkIfUserIsAdmin(userId) {
        try {
            return await database.checkIfUserIsAdmin(userId);
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

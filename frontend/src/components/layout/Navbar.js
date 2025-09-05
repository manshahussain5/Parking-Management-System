import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        setIsLoggedIn(!!token);
        setIsAdmin(adminStatus);
        
        if (token && userEmail) {
            setUserInfo({
                email: userEmail,
                name: userName || userEmail.split('@')[0]
            });
        }
    }, [location]);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserInfo(null);
            setMobileMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear state even if logout fails
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserInfo(null);
            setMobileMenuOpen(false);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
                    <div className="navbar-brand-icon">🚗</div>
                    Smart Parking
                </Link>

                <button 
                    className="navbar-mobile-toggle" 
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>

                <ul className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    {isLoggedIn ? (
                        <>
                            {userInfo && (
                                <li className="navbar-item">
                                    <div className="navbar-user-info">
                                        <div className="navbar-user-avatar">
                                            {userInfo.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="navbar-user-details">
                                            <div className="navbar-user-name">{userInfo.name}</div>
                                            <div className="navbar-user-email">{userInfo.email}</div>
                                        </div>
                                    </div>
                                </li>
                            )}
                            
                            <li className="navbar-item">
                                <Link 
                                    to="/profile" 
                                    className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    👤 Profile
                                </Link>
                            </li>
                            
                            <li className="navbar-item">
                                <Link 
                                    to="/bookings" 
                                    className={`navbar-link ${isActive('/bookings') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    📋 My Bookings
                                </Link>
                            </li>
                            
                            {isAdmin && (
                                <li className="navbar-item">
                                    <Link 
                                        to="/admin" 
                                        className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        ⚙️ Admin
                                    </Link>
                                </li>
                            )}
                            
                            <li className="navbar-item">
                                <button 
                                    className="navbar-button logout" 
                                    onClick={handleLogout}
                                    disabled={loading}
                                >
                                    {loading ? '🔄' : '🚪'} {loading ? 'Logging out...' : 'Logout'}
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link 
                                    to="/register" 
                                    className={`navbar-link ${isActive('/register') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    📝 Register
                                </Link>
                            </li>
                            
                            <li className="navbar-item">
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    🔑 Login
                                </Link>
                            </li>
                            
                            <li className="navbar-item">
                                <Link 
                                    to="/admin/login" 
                                    className={`navbar-link ${isActive('/admin/login') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    ⚙️ Admin
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

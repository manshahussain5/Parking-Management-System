import React, { useState, useEffect } from 'react';
import database from '../services/database';
import ParkingLot from './ParkingLot';
import './ParkingLot.css';

const ParkingGrid = () => {
    const [parkingLots, setParkingLots] = useState([]);
    const [filteredLots, setFilteredLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState({
        condition: 'sunny',
        temperature: 25,
        tip: 'Great weather for parking!'
    });
    const [stats, setStats] = useState({
        totalLots: 0,
        totalSlots: 0,
        availableSlots: 0,
        occupiedSlots: 0
    });

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Simulate weather data (in real app, this would come from weather API)
    useEffect(() => {
        const hour = currentTime.getHours();
        let condition, temperature, tip;
        
        if (hour >= 6 && hour <= 18) {
            condition = 'sunny';
            temperature = 22 + Math.floor(Math.random() * 15);
            tip = 'Perfect weather for outdoor parking!';
        } else {
            condition = 'night';
            temperature = 15 + Math.floor(Math.random() * 10);
            tip = 'Night parking available - well-lit areas recommended';
        }
        
        if (hour >= 9 && hour <= 17) {
            tip = 'Peak hours - book early to secure your spot!';
        }
        
        setWeather({ condition, temperature, tip });
    }, [currentTime]);

    useEffect(() => {
        const fetchParkingLots = async () => {
            setLoading(true);
            setError(null);
            try {
                const lots = await database.getParkingLots();
                setParkingLots(lots);
                setFilteredLots(lots);
                
                // Calculate statistics
                let totalSlots = 0;
                let availableSlots = 0;
                let occupiedSlots = 0;
                
                lots.forEach(lot => {
                    const slotCount = lot.slots?.length || 0;
                    totalSlots += slotCount;
                    availableSlots += lot.slots?.filter(slot => slot.isAvailable).length || 0;
                    occupiedSlots += lot.slots?.filter(slot => !slot.isAvailable).length || 0;
                });
                
                setStats({
                    totalLots: lots.length,
                    totalSlots,
                    availableSlots,
                    occupiedSlots
                });
            } catch (error) {
                console.error('Error fetching parking lots:', error);
                setError('Failed to load parking lots');
            } finally {
                setLoading(false);
            }
        };

        fetchParkingLots();
    }, [refresh]);

    // Filter and search functionality
    useEffect(() => {
        let filtered = parkingLots;
        
        // Search by name or location
        if (searchTerm) {
            filtered = filtered.filter(lot => 
                lot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lot.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by availability
        if (filterType === 'available') {
            filtered = filtered.filter(lot => 
                lot.slots?.some(slot => slot.isAvailable)
            );
        } else if (filterType === 'full') {
            filtered = filtered.filter(lot => 
                !lot.slots?.some(slot => slot.isAvailable)
            );
        }
        
        setFilteredLots(filtered);
    }, [parkingLots, searchTerm, filterType]);

    const handleLotRefresh = () => setRefresh(r => !r);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('all');
    };

    // Quick action handlers
    const handleQuickAction = (action) => {
        switch(action) {
            case 'nearest':
                // Sort by nearest (simulated)
                setFilteredLots([...parkingLots].sort((a, b) => 
                    (a.slots?.filter(s => s.isAvailable).length || 0) - 
                    (b.slots?.filter(s => s.isAvailable).length || 0)
                ).reverse());
                break;
            case 'cheapest':
                // Sort by price (simulated)
                setFilteredLots([...parkingLots].sort((a, b) => 
                    (a.hourlyRate || 5) - (b.hourlyRate || 5)
                ));
                break;
            case 'available':
                setFilterType('available');
                break;
            case 'refresh':
                handleLotRefresh();
                break;
            default:
                break;
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    if (loading) {
        return (
            <div className="parking-grid-container">
                <div className="hero-section">
                    <div className="loading">Loading parking lots...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="parking-grid-container">
                <div className="hero-section">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="parking-grid-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">🚗 Smart Parking System</h1>
                <p className="hero-subtitle">
                    Find and book parking slots instantly. Our smart system makes parking hassle-free with real-time availability and secure booking.
                </p>
                
                {/* Live Statistics Counter */}
                <div className="live-stats">
                    <div className="stat-item">
                        <div className="stat-number">{stats.totalLots}</div>
                        <div className="stat-label">Parking Lots</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{stats.totalSlots}</div>
                        <div className="stat-label">Total Slots</div>
                    </div>
                    <div className="stat-item available">
                        <div className="stat-number">{stats.availableSlots}</div>
                        <div className="stat-label">Available</div>
                    </div>
                    <div className="stat-item occupied">
                        <div className="stat-number">{stats.occupiedSlots}</div>
                        <div className="stat-label">Occupied</div>
                    </div>
                </div>
                
                <div className="hero-features">
                    <div className="hero-feature">
                        <div className="hero-feature-icon">⚡</div>
                        <h3 className="hero-feature-title">Instant Booking</h3>
                        <p className="hero-feature-description">Book your parking slot in seconds with our streamlined booking process</p>
                    </div>
                    
                    <div className="hero-feature">
                        <div className="hero-feature-icon">📱</div>
                        <h3 className="hero-feature-title">Real-time Updates</h3>
                        <p className="hero-feature-description">Get live updates on slot availability and booking status</p>
                    </div>
                    
                    <div className="hero-feature">
                        <div className="hero-feature-icon">🔒</div>
                        <h3 className="hero-feature-title">Secure & Safe</h3>
                        <p className="hero-feature-description">Your bookings are secure with our advanced authentication system</p>
                    </div>
                    
                    <div className="hero-feature">
                        <div className="hero-feature-icon">💰</div>
                        <h3 className="hero-feature-title">Cost Effective</h3>
                        <p className="hero-feature-description">Save time and money with our efficient parking management</p>
                    </div>
                </div>
            </div>

            {/* Weather & Time Section */}
            <div className="weather-time-section">
                <div className="weather-card">
                    <div className="weather-icon">
                        {weather.condition === 'sunny' ? '☀️' : '🌙'}
                    </div>
                    <div className="weather-info">
                        <div className="temperature">{weather.temperature}°C</div>
                        <div className="weather-condition">
                            {weather.condition === 'sunny' ? 'Sunny' : 'Clear Night'}
                        </div>
                    </div>
                </div>
                
                <div className="time-card">
                    <div className="time-icon">🕐</div>
                    <div className="time-info">
                        <div className="current-time">{formatTime(currentTime)}</div>
                        <div className="time-label">Current Time</div>
                    </div>
                </div>
                
                <div className="parking-tip-card">
                    <div className="tip-icon">💡</div>
                    <div className="tip-content">
                        <div className="tip-title">Parking Tip</div>
                        <div className="tip-text">{weather.tip}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="quick-actions-section">
                <h3 className="quick-actions-title">⚡ Quick Actions</h3>
                <div className="quick-actions-grid">
                    <button 
                        className="quick-action-btn"
                        onClick={() => handleQuickAction('nearest')}
                    >
                        <div className="action-icon">📍</div>
                        <div className="action-text">Nearest Available</div>
                    </button>
                    
                    <button 
                        className="quick-action-btn"
                        onClick={() => handleQuickAction('cheapest')}
                    >
                        <div className="action-icon">💰</div>
                        <div className="action-text">Cheapest Rates</div>
                    </button>
                    
                    <button 
                        className="quick-action-btn"
                        onClick={() => handleQuickAction('available')}
                    >
                        <div className="action-icon">✅</div>
                        <div className="action-text">Show Available Only</div>
                    </button>
                    
                    <button 
                        className="quick-action-btn"
                        onClick={() => handleQuickAction('refresh')}
                    >
                        <div className="action-icon">🔄</div>
                        <div className="action-text">Refresh Data</div>
                    </button>
                </div>
            </div>

            {/* Quick Search & Filter Section */}
            <div className="search-filter-section">
                <div className="search-container">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search parking lots by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="clear-search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            🏢 All Lots
                        </button>
                        <button 
                            className={`filter-btn ${filterType === 'available' ? 'active' : ''}`}
                            onClick={() => setFilterType('available')}
                        >
                            ✅ Available
                        </button>
                        <button 
                            className={`filter-btn ${filterType === 'full' ? 'active' : ''}`}
                            onClick={() => setFilterType('full')}
                        >
                            🚫 Full
                        </button>
                        {(searchTerm || filterType !== 'all') && (
                            <button 
                                className="clear-filters-btn"
                                onClick={clearFilters}
                            >
                                🗑️ Clear Filters
                            </button>
                        )}
                    </div>
                </div>
                
                {filteredLots.length !== parkingLots.length && (
                    <div className="filter-results">
                        Showing {filteredLots.length} of {parkingLots.length} parking lots
                    </div>
                )}
            </div>

            {/* Parking Lots Grid */}
            <div className="parking-grid">
                {filteredLots.length > 0 ? (
                    filteredLots.map(lot => (
                        <ParkingLot key={lot.id} lot={lot} onRefresh={handleLotRefresh} />
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            {searchTerm || filterType !== 'all' ? 'No Results Found' : 'No Parking Lots Available'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {searchTerm || filterType !== 'all' 
                                ? 'Try adjusting your search or filters to find parking lots.'
                                : 'Parking lots will appear here once they are added to the system.'
                            }
                        </p>
                        {(searchTerm || filterType !== 'all') && (
                            <button 
                                onClick={clearFilters}
                                className="btn btn-primary"
                                style={{ marginTop: '1rem' }}
                            >
                                🗑️ Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParkingGrid;

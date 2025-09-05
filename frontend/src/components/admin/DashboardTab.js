import React, { useState, useEffect } from 'react';
import database from '../../services/database';

const DashboardTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch data from database service
                const [users, lots, bookings] = await Promise.all([
                    database.getAllUsers(),
                    database.getParkingLots(),
                    database.getAllBookings()
                ]);

                const totalUsers = users.length;
                const totalLots = lots.length;
                const totalBookings = bookings.length;
                
                // Calculate active bookings
                const activeBookings = bookings.filter(booking => booking.status === 'active').length;

                setStats({
                    totalUsers,
                    totalLots,
                    totalBookings,
                    activeBookings
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading">
                Loading dashboard statistics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                ❌ {error}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: '👥',
            iconClass: 'users',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Parking Lots',
            value: stats?.totalLots || 0,
            icon: '🚗',
            iconClass: 'lots',
            change: '+5%',
            changeType: 'positive'
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: '📋',
            iconClass: 'bookings',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Active Bookings',
            value: stats?.activeBookings || 0,
            icon: '✅',
            iconClass: 'active',
            change: '+15%',
            changeType: 'positive'
        }
    ];

    return (
        <div>
            {/* Welcome Section */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h2 className="admin-section-title">
                        🎉 Welcome back, {localStorage.getItem('userName') || 'Admin'}!
                    </h2>
                    <div className="admin-section-actions">
                        <span className="text-secondary">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                    </div>
                </div>
                <div className="admin-section-content">
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Here's an overview of your parking system performance and key metrics.
                    </p>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="admin-stats-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="admin-stat-card">
                        <div className="admin-stat-header">
                            <div className={`admin-stat-icon ${card.iconClass}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="admin-stat-value">{card.value}</div>
                        <div className="admin-stat-label">{card.title}</div>
                        <div className={`admin-stat-change ${card.changeType}`}>
                            {card.changeType === 'positive' ? '↗' : '↘'} {card.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h2 className="admin-section-title">📈 Recent Activity</h2>
                </div>
                <div className="admin-section-content">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.05)', borderRadius: 'var(--border-radius-sm)' }}>
                            <div style={{ fontSize: '1.5rem' }}>🎉</div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>New user registered</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>2 minutes ago</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--border-radius-sm)' }}>
                            <div style={{ fontSize: '1.5rem' }}>✅</div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>New booking created</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>5 minutes ago</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--border-radius-sm)' }}>
                            <div style={{ fontSize: '1.5rem' }}>🚗</div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Parking lot updated</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>10 minutes ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;

import React, { useEffect, useState } from 'react';
import database from '../services/database';
import './BookingHistory.css';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('token');
                const bookingsData = await database.getBookingsByUserId(userId);
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setAlert('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        try {
            const booking = bookings.find(b => b.id === bookingId);
            if (booking) {
                // Update booking status
                await database.updateBooking(bookingId, { status: 'cancelled' });
                
                // Make slot available again
                await database.updateSlotAvailability(booking.lotId, booking.slotId, true);
                
                setAlert('Booking cancelled successfully');
                setBookings(bookings => bookings.map(b => 
                    b.id === bookingId ? { ...b, status: 'cancelled' } : b
                ));
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setAlert('Failed to cancel booking');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString;
    };

    if (loading) {
        return (
            <div className="booking-history-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    Loading your bookings...
                </div>
            </div>
        );
    }

    return (
        <div className="booking-history-container">
            {/* Header */}
            <div className="booking-history-header">
                <h1 className="booking-history-title">📋 My Bookings</h1>
                <p className="booking-history-subtitle">
                    Manage and track all your parking reservations
                </p>
            </div>

            {/* Alert */}
            {alert && (
                <div className={`booking-alert ${alert.includes('cancelled') ? 'success' : 'error'}`}>
                    {alert.includes('cancelled') ? '✅' : '❌'} {alert}
                </div>
            )}

            {/* Bookings Table */}
            {bookings.length > 0 ? (
                <div className="booking-table-container">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>🚗 Parking Lot</th>
                                <th>📍 Slot</th>
                                <th>📅 Date</th>
                                <th>🕐 Time</th>
                                <th>📊 Status</th>
                                <th>⚙️ Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} className={booking.status === 'cancelled' ? 'cancelled' : ''}>
                                    <td>
                                        <div className="booking-lot-info">
                                            <span className="booking-lot-icon">🚗</span>
                                            <span>{booking.lotId || 'Unknown Lot'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="booking-slot-info">
                                            <span className="booking-slot-icon">📍</span>
                                            <span>{booking.slotId || 'Unknown Slot'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="booking-date-time">
                                            <span className="booking-date">{formatDate(booking.date)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="booking-date-time">
                                            <span className="booking-time">{formatTime(booking.time)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`booking-status ${booking.status}`}>
                                            {booking.status === 'active' && '✅ Active'}
                                            {booking.status === 'cancelled' && '❌ Cancelled'}
                                            {booking.status === 'completed' && '✅ Completed'}
                                            {!booking.status && '📊 Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="booking-actions">
                                            {booking.status === 'active' && (
                                                <button 
                                                    className="btn-cancel" 
                                                    onClick={() => cancelBooking(booking.id)}
                                                >
                                                    🗑️ Cancel
                                                </button>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                                                    Cancelled
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-bookings">
                    <div className="empty-bookings-icon">🚗</div>
                    <h2 className="empty-bookings-title">No Bookings Found</h2>
                    <p className="empty-bookings-text">
                        You haven't made any parking bookings yet. 
                        <br />
                        Start by exploring available parking lots and booking your first slot!
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;

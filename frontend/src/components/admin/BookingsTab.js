import React, { useEffect, useState } from 'react';
import database from '../../services/database';

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const bookingsData = await database.getAllBookings();
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setAlert('An error occurred while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        // Update booking status
        await database.updateBooking(bookingId, {
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        });
        
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: '✅', class: 'success', text: 'Active' },
      completed: { icon: '🏁', class: 'info', text: 'Completed' },
      cancelled: { icon: '❌', class: 'danger', text: 'Cancelled' },
      pending: { icon: '⏳', class: 'warning', text: 'Pending' }
    };
    
    const config = statusConfig[status] || { icon: '❓', class: 'default', text: status };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      {/* Header */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">📋 Booking Management</h2>
          <div className="admin-section-actions">
            <button 
              className="btn btn-primary" 
              onClick={fetchBookings}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="admin-section-content">
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Monitor and manage all parking bookings across the system.
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert ${alert.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {alert.includes('successfully') ? '✅' : '❌'} {alert}
        </div>
      )}

      {/* Filters */}
      <div className="admin-section">
        <div className="admin-section-content">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-outline ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📊 All ({bookings.length})
            </button>
            <button 
              className={`btn btn-outline ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              ✅ Active ({bookings.filter(b => b.status === 'active').length})
            </button>
            <button 
              className={`btn btn-outline ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              🏁 Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button 
              className={`btn btn-outline ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              ❌ Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-section">
        <div className="admin-section-content">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>👤 User</th>
                  <th>🚗 Parking Lot</th>
                  <th>📍 Slot</th>
                  <th>📅 Date</th>
                  <th>⏰ Time</th>
                  <th>💰 Amount</th>
                  <th>📊 Status</th>
                  <th>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(booking => (
                    <tr key={booking.id} style={{ opacity: booking.status === 'cancelled' ? 0.6 : 1 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="user-avatar">
                            {booking.userName?.charAt(0)?.toUpperCase() || booking.userEmail?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {booking.userName || 'Unknown User'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {booking.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {booking.lotName || `Lot ${booking.lotId}`}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {booking.lotId}
                        </div>
                      </td>
                      <td>
                        <span className="slot-badge">
                          {booking.slotName || `Slot ${booking.slotId}`}
                        </span>
                      </td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{formatTime(booking.time)}</td>
                      <td>
                        <span className="amount-badge">
                          ${booking.amount || '0.00'}
                        </span>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        {booking.status === 'active' && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleCancelBooking(booking.id)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              fontSize: '0.875rem',
                              color: 'var(--danger)',
                              borderColor: 'var(--danger)'
                            }}
                          >
                            🗑️ Cancel
                          </button>
                        )}
                        {booking.status !== 'active' && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;

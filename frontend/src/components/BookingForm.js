import React, { useState } from 'react';
import database from '../services/database';

const BookingForm = ({ lotId, slotId, onBooked, onClose }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        
        try {
            const userId = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail');
            const userName = localStorage.getItem('userName');

            // Create booking in database
            const bookingData = {
                userId,
                userEmail,
                userName,
                lotId,
                slotId,
                date,
                time,
                status: 'active'
            };

            await database.createBooking(bookingData);

            // Update slot availability
            await database.updateSlotAvailability(lotId, slotId, false);

            setAlert('Booking successful!');
            onBooked && onBooked();
        } catch (error) {
            console.error('Booking error:', error);
            setAlert('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="booking-form">
            <h3>🚗 Book Parking Slot</h3>
            
            {alert && (
                <div className={`alert ${alert.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {alert.includes('success') ? '✅' : '❌'} {alert}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="slot-info">Slot Information</label>
                    <input
                        type="text"
                        id="slot-info"
                        value={`Slot ${slotId}`}
                        disabled
                        style={{ backgroundColor: 'var(--background-color)', cursor: 'not-allowed' }}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="date">📅 Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={today}
                        placeholder="Select date"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="time">🕐 Time</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        placeholder="Select time"
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={loading}
                        className="btn-secondary"
                    >
                        ❌ Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || !date || !time}
                        className="btn-primary"
                    >
                        {loading ? '🔄' : '✅'} {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;

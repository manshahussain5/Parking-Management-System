import React, { useState } from 'react';
import BookingForm from './BookingForm';
import './ParkingLot.css';

const ParkingLot = ({ lot, onRefresh }) => {
    const [bookingSlot, setBookingSlot] = useState(null);

    const handleBooked = () => {
        setBookingSlot(null);
        if (onRefresh) onRefresh();
    };

    const availableSlots = lot.slots.filter(slot => slot.isAvailable).length;
    const totalSlots = lot.slots.length;
    const occupancyRate = ((totalSlots - availableSlots) / totalSlots * 100).toFixed(1);

    return (
        <div className="parking-lot">
            <div className="parking-lot-header">
                <h3 className="parking-lot-title">{lot.name}</h3>
                <div className="parking-lot-location">{lot.location}</div>
            </div>

            <div className="slots-container">
                {lot.slots.map((slot, index) => (
                    <div 
                        key={slot.id} 
                        className={`parking-slot ${slot.isAvailable ? 'available' : 'occupied'}`}
                        title={slot.isAvailable ? `Book slot ${slot.name || index + 1}` : `Slot ${slot.name || index + 1} is occupied`}
                    >
                        <span>{slot.name || index + 1}</span>
                        {slot.isAvailable && localStorage.getItem('token') && (
                            <button 
                                className="parking-slot book-btn" 
                                onClick={() => setBookingSlot(slot.id)}
                                title={`Book slot ${slot.name || index + 1}`}
                            >
                                Book
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="parking-lot-stats">
                <div className="parking-lot-stat">
                    <div className="parking-lot-stat-value">{availableSlots}</div>
                    <div className="parking-lot-stat-label">Available</div>
                </div>
                <div className="parking-lot-stat">
                    <div className="parking-lot-stat-value">{totalSlots - availableSlots}</div>
                    <div className="parking-lot-stat-label">Occupied</div>
                </div>
                <div className="parking-lot-stat">
                    <div className="parking-lot-stat-value">{occupancyRate}%</div>
                    <div className="parking-lot-stat-label">Occupancy</div>
                </div>
            </div>

            {bookingSlot && (
                <div className="modal-bg" onClick={() => setBookingSlot(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <BookingForm 
                            lotId={lot.id} 
                            slotId={bookingSlot} 
                            onBooked={handleBooked} 
                            onClose={() => setBookingSlot(null)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParkingLot;


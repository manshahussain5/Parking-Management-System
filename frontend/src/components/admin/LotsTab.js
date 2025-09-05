import React, { useState, useEffect } from 'react';
import database from '../../services/database';

const LotsTab = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editingLot, setEditingLot] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    location: '', 
    numberOfSlots: 100,
    hourlyRate: 5.00,
    description: ''
  });

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const lotsData = await database.getParkingLots();
      setLots(lotsData);
    } catch (error) {
      console.error('Error fetching lots:', error);
      setAlert('Failed to load parking lots');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      return setAlert('Please fill in all required fields');
    }

    try {
      if (editingLot) {
        // Update existing lot
        await database.updateParkingLot(editingLot.id, {
          name: formData.name,
          location: formData.location,
          hourlyRate: formData.hourlyRate,
          description: formData.description,
          updatedAt: new Date().toISOString()
        });
        setAlert('Parking lot updated successfully!');
      } else {
        // Add new lot
        const slots = [];
        for (let i = 1; i <= formData.numberOfSlots; i++) {
          slots.push({
            id: `slot-${i}`,
            name: `Slot ${i}`,
            isAvailable: true,
            isReserved: false
          });
        }

        await database.createParkingLot({
          name: formData.name,
          location: formData.location,
          numberOfSlots: formData.numberOfSlots,
          hourlyRate: formData.hourlyRate,
          description: formData.description,
          slots: slots
        });
        setAlert('Parking lot added successfully!');
      }

      setFormData({ 
        name: '', 
        location: '', 
        numberOfSlots: 100,
        hourlyRate: 5.00,
        description: ''
      });
      setEditingLot(null);
      fetchLots();
    } catch (error) {
      console.error('Error saving lot:', error);
      setAlert('Failed to save parking lot');
    }
  };

  const handleEdit = (lot) => {
    setEditingLot(lot);
    setFormData({ 
      name: lot.name || '', 
      location: lot.location || '', 
      numberOfSlots: lot.numberOfSlots || 100,
      hourlyRate: lot.hourlyRate || 5.00,
      description: lot.description || ''
    });
  };

  const handleDelete = async (lotId) => {
    if (!window.confirm('Are you sure you want to delete this parking lot? This action cannot be undone.')) {
      return;
    }

    try {
      await database.deleteParkingLot(lotId);
      setAlert('Parking lot deleted successfully!');
      fetchLots();
    } catch (error) {
      console.error('Error deleting lot:', error);
      setAlert('Failed to delete parking lot');
    }
  };

  const cancelEdit = () => {
    setEditingLot(null);
    setFormData({ 
      name: '', 
      location: '', 
      numberOfSlots: 100,
      hourlyRate: 5.00,
      description: ''
    });
  };

  const getAvailableSlots = (lot) => {
    if (!lot.slots) return 0;
    return lot.slots.filter(slot => slot.isAvailable).length;
  };

  const getOccupiedSlots = (lot) => {
    if (!lot.slots) return 0;
    return lot.slots.filter(slot => !slot.isAvailable).length;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        Loading parking lots...
      </div>
    );
  }

  return (
    <div className="admin-lots">
      {/* Header */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">🚗 Parking Lot Management</h2>
          <div className="admin-section-actions">
            <button 
              className="btn btn-primary" 
              onClick={fetchLots}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="admin-section-content">
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Create and manage parking lots, set rates, and monitor availability.
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert ${alert.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {alert.includes('successfully') ? '✅' : '❌'} {alert}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">
            {editingLot ? '✏️ Edit Parking Lot' : '➕ Add New Parking Lot'}
          </h3>
        </div>
        <div className="admin-section-content">
          <form onSubmit={handleSubmit} className="admin-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="name">🏢 Lot Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter lot name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">📍 Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  required
                />
              </div>
              
              {!editingLot && (
                <div className="form-group">
                  <label htmlFor="numberOfSlots">🔢 Number of Slots *</label>
                  <input
                    type="number"
                    id="numberOfSlots"
                    name="numberOfSlots"
                    value={formData.numberOfSlots}
                    onChange={handleInputChange}
                    placeholder="Enter number of slots"
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="hourlyRate">💰 Hourly Rate ($)</label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  placeholder="Enter hourly rate"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">📝 Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter lot description"
                rows="3"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingLot ? '✏️ Update Lot' : '➕ Add Lot'}
              </button>
              {editingLot && (
                <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Lots Table */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">📊 Manage Existing Lots</h3>
        </div>
        <div className="admin-section-content">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>🏢 Lot Name</th>
                  <th>📍 Location</th>
                  <th>🔢 Total Slots</th>
                  <th>✅ Available</th>
                  <th>🚫 Occupied</th>
                  <th>💰 Rate/Hour</th>
                  <th>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No parking lots found
                    </td>
                  </tr>
                ) : (
                  lots.map(lot => (
                    <tr key={lot.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {lot.name}
                          </div>
                          {lot.description && (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {lot.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{lot.location}</td>
                      <td>
                        <span className="slot-badge total">
                          {lot.slots?.length || lot.numberOfSlots || 0}
                        </span>
                      </td>
                      <td>
                        <span className="slot-badge available">
                          {getAvailableSlots(lot)}
                        </span>
                      </td>
                      <td>
                        <span className="slot-badge occupied">
                          {getOccupiedSlots(lot)}
                        </span>
                      </td>
                      <td>
                        <span className="rate-badge">
                          ${lot.hourlyRate || 0}/hr
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleEdit(lot)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleDelete(lot.id)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              fontSize: '0.875rem',
                              color: 'var(--danger)',
                              borderColor: 'var(--danger)'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
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

export default LotsTab;

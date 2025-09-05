import React, { useEffect, useState } from 'react';
import database from '../../services/database';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', isAdmin: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const usersData = await database.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name || '', 
      email: user.email || '', 
      isAdmin: user.isAdmin || false 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await database.updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
        updatedAt: new Date().toISOString()
      });

      setAlert('User updated successfully');
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await database.deleteUser(userId);
      setAlert('User deleted successfully');
      setUsers(users => users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        Loading users...
      </div>
    );
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">👥 User Management</h2>
          <div className="admin-section-actions">
            <button 
              className="btn btn-primary" 
              onClick={fetchUsers}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="admin-section-content">
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Manage user accounts, permissions, and access levels.
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert ${alert.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
          {alert.includes('successfully') ? '✅' : '❌'} {alert}
        </div>
      )}

      {/* Users Table */}
      <div className="admin-section">
        <div className="admin-section-content">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>👤 User</th>
                  <th>📧 Email</th>
                  <th>👑 Role</th>
                  <th>📅 Created</th>
                  <th>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="user-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                              {user.name || 'Unnamed User'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                          {user.isAdmin ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleEditClick(user)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleDelete(user.id)}
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

      {/* Edit Modal */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>✏️ Edit User</h3>
              <button 
                className="admin-modal-close" 
                onClick={() => setEditingUser(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="admin-modal-content">
              <div className="form-group">
                <label htmlFor="edit-name">👤 Name</label>
                <input 
                  type="text" 
                  id="edit-name"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required
                  placeholder="Enter user name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email">📧 Email</label>
                <input 
                  type="email" 
                  id="edit-email"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  required
                  placeholder="Enter user email"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.isAdmin} 
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })} 
                  />
                  <span>👑 Grant Admin Privileges</span>
                </label>
              </div>
              <div className="admin-modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;

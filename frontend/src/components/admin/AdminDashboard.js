import React, { useState } from 'react';
import UsersTab from './UsersTab';
import LotsTab from './LotsTab';
import BookingsTab from './BookingsTab';
import DashboardTab from './DashboardTab';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'lots', label: '🚗 Parking Lots', icon: '🚗' },
    { id: 'bookings', label: '📋 Bookings', icon: '📋' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'users':
        return <UsersTab />;
      case 'lots':
        return <LotsTab />;
      case 'bookings':
        return <BookingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <div className="admin-icon">⚙️</div>
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage your parking system efficiently</p>
            </div>
          </div>
          <div className="admin-actions">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {localStorage.getItem('userName')?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="admin-user-details">
                <div className="admin-user-name">{localStorage.getItem('userName') || 'Admin'}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="admin-nav-icon">{tab.icon}</span>
                <span className="admin-nav-label">{tab.label}</span>
                {activeTab === tab.id && <div className="admin-nav-indicator" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Panel */}
        <div className="admin-main-panel">
          <div className="admin-panel-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

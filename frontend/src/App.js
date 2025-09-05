import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ParkingGrid from './components/ParkingGrid';
import Register from './components/auth/Register';
import AdminRegister from './components/auth/AdminRegister';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/auth/Login';
import ProfilePage from './components/ProfilePage';
import BookingHistory from './components/BookingHistory';
import './App.css';

// Auth-protected route
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Admin-protected route
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return token && isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <header className="App-header">
          <h1>Smart Parking System</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ParkingGrid />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


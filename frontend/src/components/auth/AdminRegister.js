import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth';
import './Auth.css';

const AdminRegister = () => {
    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = admin;

    const onChange = e => setAdmin({ ...admin, [e.target.name]: e.target.value });

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        
        if (password !== password2) {
            setAlert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setAlert('Password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        setAlert(null);
        
        try {
            const result = await authService.registerAdmin(email, password, name);
            
            if (result.success) {
                setAlert('Admin registration successful! Redirecting to admin dashboard...');
                setTimeout(() => window.location.href = '/admin', 1000);
            } else {
                setAlert(result.error);
            }
        } catch (error) {
            console.error('Admin registration error:', error);
            setAlert('Admin registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
                <h1>
                    Admin <span className='text-primary'>Registration</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Create a new admin account to manage the parking system
                </p>
            </div>
            
            {alert && (
                <div className={`alert ${alert.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {alert.includes('successful') ? '✅' : '❌'} {alert}
                </div>
            )}
            
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>👤 Admin Name</label>
                    <input 
                        type='text' 
                        name='name' 
                        id='name'
                        value={name} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter admin name"
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor='email'>📧 Admin Email</label>
                    <input 
                        type='email' 
                        name='email' 
                        id='email'
                        value={email} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter admin email"
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor='password'>🔒 Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password'
                        value={password} 
                        onChange={onChange} 
                        required 
                        minLength='6'
                        placeholder="Enter password (min 6 characters)"
                    />
                </div>
                
                <div className='form-group'>
                    <label htmlFor='password2'>🔐 Confirm Password</label>
                    <input 
                        type='password' 
                        name='password2' 
                        id='password2'
                        value={password2} 
                        onChange={onChange} 
                        required 
                        minLength='6'
                        placeholder="Confirm your password"
                    />
                </div>
                
                <input 
                    type='submit' 
                    value={loading ? 'Creating Admin Account...' : 'Create Admin Account'} 
                    className='btn btn-primary btn-block' 
                    disabled={loading}
                />
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Already have admin access?
                </p>
                <Link to="/admin/login" className="btn btn-outline" style={{ marginRight: '1rem' }}>
                    ⚙️ Admin Login
                </Link>
                <Link to="/register" className="btn btn-outline">
                    👤 Regular Register
                </Link>
            </div>
        </div>
    );
};

export default AdminRegister; 
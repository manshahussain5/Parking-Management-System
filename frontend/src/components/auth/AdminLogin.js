import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth';
import './Auth.css';

const AdminLogin = () => {
    const [admin, setAdmin] = useState({
        email: '',
        password: ''
    });

    const { email, password } = admin;

    const onChange = e => setAdmin({ ...admin, [e.target.name]: e.target.value });

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        
        try {
            const result = await authService.loginAdmin(email, password);
            
            if (result.success) {
                setAlert('Admin login successful! Redirecting...');
                setTimeout(() => window.location.href = '/admin', 1000);
            } else {
                setAlert(result.error);
            }
        } catch (error) {
            console.error('Admin login error:', error);
            setAlert('Admin login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <h1>
                    Admin <span className='text-primary'>Login</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Access the admin dashboard to manage your parking system
                </p>
            </div>
            
            {alert && (
                <div className={`alert ${alert.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {alert.includes('successful') ? '✅' : '❌'} {alert}
                </div>
            )}
            
            <form onSubmit={onSubmit}>
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
                    <label htmlFor='password'>🔒 Admin Password</label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password'
                        value={password} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter admin password"
                    />
                </div>
                <input 
                    type='submit' 
                    value={loading ? 'Signing in...' : 'Sign in as Admin'} 
                    className='btn btn-primary btn-block' 
                    disabled={loading}
                />
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Don't have admin access?
                </p>
                <Link to="/admin/register" className="btn btn-outline" style={{ marginRight: '1rem' }}>
                    📝 Register as Admin
                </Link>
                <Link to="/login" className="btn btn-outline">
                    🔑 Regular Login
                </Link>
            </div>
        </div>
    );
};

export default AdminLogin; 
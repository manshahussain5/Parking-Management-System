import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth';
import './Auth.css';

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const { email, password } = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        
        try {
            const result = await authService.login(email, password);
            
            if (result.success) {
                setAlert('Login successful! Redirecting...');
                setTimeout(() => window.location.href = '/', 1000);
            } else {
                setAlert(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            setAlert('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                <h1>
                    Account <span className='text-primary'>Login</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Sign in to access your parking account
                </p>
            </div>
            
            {alert && (
                <div className={`alert ${alert.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {alert.includes('successful') ? '✅' : '❌'} {alert}
                </div>
            )}
            
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>📧 Email Address</label>
                    <input 
                        type='email' 
                        name='email' 
                        id='email'
                        value={email} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter your email address"
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
                        placeholder="Enter your password"
                    />
                </div>
                <input 
                    type='submit' 
                    value={loading ? 'Signing in...' : 'Sign In'} 
                    className='btn btn-primary btn-block' 
                    disabled={loading}
                />
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Don't have an account?
                </p>
                <Link to="/register" className="btn btn-outline" style={{ marginRight: '1rem' }}>
                    📝 Create Account
                </Link>
                <Link to="/admin/login" className="btn btn-outline">
                    ⚙️ Admin Login
                </Link>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import authService from '../../services/auth';
import './Auth.css';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

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
            const result = await authService.register(email, password, name);
            
            if (result.success) {
                setAlert('Registration successful! Redirecting...');
                setTimeout(() => window.location.href = '/', 1000);
            } else {
                setAlert(result.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setAlert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                <h1>
                    Account <span className='text-primary'>Register</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Create your account to start booking parking slots
                </p>
            </div>
            
            {alert && (
                <div className={`alert ${alert.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                    {alert.includes('successful') ? '✅' : '❌'} {alert}
                </div>
            )}
            
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>👤 Full Name</label>
                    <input 
                        type='text' 
                        name='name' 
                        id='name'
                        value={name} 
                        onChange={onChange} 
                        required 
                        placeholder="Enter your full name"
                    />
                </div>
                
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
                    value={loading ? 'Creating Account...' : 'Create Account'} 
                    className='btn btn-primary btn-block' 
                    disabled={loading}
                />
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Need admin access?
                </p>
                <a href="/admin/register" className="btn btn-outline" style={{ marginRight: '1rem' }}>
                    👑 Admin Register
                </a>
                <a href="/admin/login" className="btn btn-outline">
                    ⚙️ Admin Login
                </a>
            </div>
        </div>
    );
};

export default Register;

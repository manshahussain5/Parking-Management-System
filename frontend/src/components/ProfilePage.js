import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail');
            const userName = localStorage.getItem('userName');
            
            const res = await fetch('http://localhost:5001/api/users/profile', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail
                })
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setForm({ name: data.name, email: data.email, password: '' });
            } else {
                setAlert(data.msg || 'Failed to load profile');
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setAlert(null);
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/users/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
            setAlert('Profile updated!');
            setProfile(data.user);
            setForm({ ...form, password: '' });
            // Update localStorage with new user info
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
        } else {
            setAlert(data.msg || 'Update failed');
        }
        setLoading(false);
    };

    if (loading) return <div style={{textAlign:'center'}}>Loading...</div>;

    return (
        <div className="form-container">
            <h1>My Profile</h1>
            {alert && <div style={{ color: alert.includes('updated') ? 'green' : 'red', marginBottom: 10 }}>{alert}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input name="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>New Password (optional)</label>
                    <input type="password" name="password" value={form.password} onChange={onChange} />
                </div>
                <button className="btn btn-primary btn-block" type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfilePage;

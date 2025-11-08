import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://bank-backend-server.onrender.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      console.log('Response:', response);
  
      if (response.ok) {
        // Admin login successful, redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Admin login failed
        console.error('Admin login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during admin login', error);
    }
  };

  return (
    <div className="login-form-container" >
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Add input fields for admin login */}
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;

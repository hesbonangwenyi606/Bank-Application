import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css'; 

const AdminSignupPage = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://bank-backend-server.onrender.com/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response Content:', await response.text());

      if (response.ok) {
        // Admin signup successful, redirect to admin login page
        navigate('/admin/login');
      } else {
        // Admin signup failed, update error message
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || 'Admin signup failed');
      }
    } catch (error) {
      console.error('Error during admin signup', error);
      setErrorMessage('An error occurred during admin signup');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup as Admin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AdminSignupPage;

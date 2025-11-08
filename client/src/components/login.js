import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSuccess = async (userId) => {
    try {
      const userResponse = await fetch(`https://bank-backend-server.onrender.com/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);

        // Update the user data state and navigate to the user dashboard
        setUserData(userData.user);
        navigate(`/dashboard/${userId}`);
      } else {
        console.error('Error fetching user data:', userResponse.statusText);

        if (userResponse.status === 500) {
          setErrorMessage('Internal Server Error. Please try again later.');
        } else {
          setErrorMessage('Error fetching user data.');
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch('https://bank-backend-server.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);

        if (!data.user || !data.user.id) {
          setErrorMessage('User ID not found in the response.');
          return;
        }

        // Fetch user data after successful login
        handleLoginSuccess(data.user.id);
      } else {
        console.error('Login failed:', data.message);
        setErrorMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Add your existing form fields here */}
        <div className="centered-input">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="centered-input">
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="centered-input">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginForm;

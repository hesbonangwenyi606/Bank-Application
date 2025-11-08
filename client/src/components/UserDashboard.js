import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserAccountsPage from './UserAccountsPage';
import'./UserDashboard.css'

const UserDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`https://bank-backend-server.onrender.com/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData.user);
        } else {
          console.error('Error fetching user data. Status:', response.status);
          const errorMessage = await response.text();
          console.error('Error message:', errorMessage);
          setError(`Error fetching user data: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle logout function
  const handleLogout = () => {
    // Add logic to perform logout actions (clear tokens, etc.)
    // For now, let's just redirect to the login page
    navigate('/');
  };

  return (
    <div className='.container '>
      <h1>Your Dashboard</h1>
      {loading && <p>Fetching user data...</p>}
      {error && <p>{error}</p>}
      {userData && (
        <div className='user-info'>
          <h2>User Information</h2>
          
          <h2>First Name: {userData.first_name}</h2>
          <h2>Last Name: {userData.last_name}</h2>
          <h2>Username: {userData.username}</h2>
          <h3>Email: {userData.email}</h3>

          {/* Route for the User Accounts Page */}
          <UserAccountsPage userId={userId} />

          
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteUser from './DeleteUser';

const AdminDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the fetchUsersData function outside useEffect
  const fetchUsersData = async () => {
    try {
      const response = await fetch('https://bank-backend-server.onrender.com/admin/users-with-accounts');

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsersData(data);
        } else if (data.users) {
          setUsersData(data.users);
        } else {
          setError('Invalid data format received.');
        }
      } else {
        setError('Failed to fetch users data.');
      }
    } catch (error) {
      setError('Error fetching users data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call fetchUsersData inside useEffect
    fetchUsersData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Clients:</h2>
      {Array.isArray(usersData) && usersData.length > 0 ? (
        usersData.map((user) => (
          <div key={user.id}>
            <h2>Username: {user.username}</h2>
            <h2>Name: {`${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`}</h2>
            <h2>Email: {user.email || 'N/A'}</h2>

            <DeleteUser userId={user.id} onDeleteSuccess={fetchUsersData} />

            {user.accounts && user.accounts.length > 0 && (
              <div>
                <h3>User Accounts</h3>
                {user.accounts.map((account) => (
                  <div key={account.id}>
                    <h2>Account Name: {account.account_name}</h2>
                    <h2>Balance: ${account.balance}</h2>
                  </div>
                ))}
              </div>
            )}

            
            <hr />
          </div>
        ))
      ) : (
        <p>No users data available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

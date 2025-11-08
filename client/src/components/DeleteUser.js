import React, { useState } from 'react';

const DeleteUser = ({ userId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleDelete = async () => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!isConfirmed) {
      return; 
    }

    try {
      setLoading(true);

      // Send a DELETE request to the backend
      const response = await fetch(`https://bank-backend-server.onrender.com/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        
        onDeleteSuccess(userId);

        // Set success message
        setSuccessMessage('User deleted successfully!');
      } else {
        // If unsuccessful, handle the error
        const errorMessage = await response.text();
        setError(`Error deleting user: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        Delete User
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default DeleteUser;

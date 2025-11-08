// EditAccountNameForm.js
import React, { useState } from 'react';

const EditAccountNameForm = ({ user_id, account_id, currentName, onEdit }) => {
  const [newAccountName, setNewAccountName] = useState(currentName);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://bank-backend-server.onrender.com/user/${user_id}/accounts/${account_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_account_name: newAccountName }),
      });

      if (response.ok) {
        // If the request is successful, call the onEdit function
        onEdit(account_id, newAccountName);
        console.log('Account name updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Error updating account name:', errorData);
        // Handle the error, show a message, etc.
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      // Handle network errors, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={`editAccountName_${account_id}`}>Edit Account Name:</label>
      <input
        type="text"
        id={`editAccountName_${account_id}`}
        name={`editAccountName_${account_id}`}
        value={newAccountName}
        onChange={(e) => setNewAccountName(e.target.value)}
        required
      />
      <button type="submit">Edit Name</button>
    </form>
  );
};

export default EditAccountNameForm;

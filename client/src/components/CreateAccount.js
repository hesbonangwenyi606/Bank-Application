import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CreateAccount = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    accountName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to create a new account
      const response = await fetch(`https://bank-backend-server.onrender.com/user/${userId}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Optional: Handle success or navigate to another page
      console.log('Account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      // Optional: Handle error or display a message to the user
    }
  };

  return (
    <div>
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Name:</label>
          <select name="accountName" value={formData.accountName} onChange={handleChange} required>
            <option value="">Select Account Name</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Add other form fields as needed */}
        <button type="submit">Create Account</button>
      </form>

      {/* Container for displaying an image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
        <img
          src="https://images.pexels.com/photos/3833052/pexels-photo-3833052.jpeg?auto=compress&cs=tinysrgb&w=1000"  
          alt="Your Image Alt Text"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
        />
      </div>
    </div>
  );
};

export default CreateAccount;

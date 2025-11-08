// SignUpForm.js

import React, { useState } from 'react';


const SignUpForm = ({ userType }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${userType.toLowerCase()}https://bank-backend-server.onrender.com/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // You can handle the response data as needed

    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... (unchanged JSX) */}
      <button type="submit">Register</button>
    </form>
  );
};

export default SignUpForm;
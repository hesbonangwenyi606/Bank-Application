// TransactionForm.js
import React, { useState } from 'react';

const TransactionForm = ({ accountId, onTransactionAdded }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if amount and description are not empty
    if (!amount.trim() || !description.trim()) {
      setError('Please enter both amount and description.');
      return;
    }

    // Prepare transaction data
    const transactionData = {
      amount: parseFloat(amount),
      description: description,
      account_id: accountId,
      // No need to include user_id in the data since it's already part of the route
      // Add other fields as needed
    };

    try {
      // Send transaction data to the Flask backend
      const response = await fetch(`https://bank-backend-server.onrender.com/${accountId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Transaction added successfully:', data);

      // Notify the parent component that a new transaction has been added
      onTransactionAdded();

      // Clear form fields and error
      setAmount('');
      setDescription('');
      setError(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount:$</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default TransactionForm;

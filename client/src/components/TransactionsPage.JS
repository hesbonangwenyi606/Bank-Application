// TransactionsPage.js
import React, { useState, useEffect } from 'react';

const TransactionsPage = ({ userId, accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Fetch transactions data from the backend for the specific user and account
        const response = await fetch(`https://bank-backend-server.onrender.com/user/${userId}/accounts/${accountId}/transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const transactionsData = await response.json();
          console.log('Transactions data:', transactionsData);

          // Update the transactions state
          setTransactions(transactionsData.transactions);
        } else {
          console.error('Error fetching transactions. Status:', response.status);
          const errorMessage = await response.text();
          console.error('Error message:', errorMessage);
          setError(`Error fetching transactions: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, accountId]);

  return (
    <div>
      <h2>Transactions List</h2>
      {loading && <p>Loading transactions...</p>}
      {error && <p>{error}</p>}
      {transactions.length > 0 && (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              <p>Amount: {transaction.amount}</p>
              <p>Description: {transaction.description}</p>
              <p>Date: {transaction.transaction_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;

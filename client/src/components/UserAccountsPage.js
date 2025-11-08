import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import EditAccountNameForm from './EditAccountNameForm';
import DeleteAccount from './DeleteAccount';
import'./UserAccountsPage.css'


const UserAccountsPage = ({ userId }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        setLoading(true);

        // Fetch user accounts data from the backend
        const response = await fetch(`https://bank-backend-server.onrender.com/user/${userId}/accounts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const accountsData = await response.json();
          console.log('User accounts data:', accountsData);

          // Update the accounts state
          setAccounts(accountsData.accounts);
        } else {
          console.error('Error fetching user accounts. Status:', response.status);
          const errorMessage = await response.text();
          console.error('Error message:', errorMessage);
          setError(`Error fetching user accounts: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error fetching user accounts:', error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccounts();
  }, [userId]);

  // Function to handle the edit of an account name
  const handleEditAccountName = (accountId, newAccountName) => {
    // Update the accounts state with the new account name
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === accountId ? { ...account, account_name: newAccountName } : account
      )
    );

    // Set success message
    setSuccessMessage(`Account name updated successfully for account ${accountId}`);

    // Clear success message after a few seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Function to delete a transaction
  const handleDeleteTransaction = (accountId, transactionId) => {
    // Implement the logic to delete the transaction here
    // Update the accounts state accordingly
    console.log(`Deleting transaction ${transactionId} for account ${accountId}`);
  };

  // Function to delete an account
  const handleDeleteAccount = (accountId) => {
    // Implement the logic to delete the account here
    // Update the accounts state accordingly
    console.log(`Deleting account ${accountId}`);

    // Set success message for account deletion
    setSuccessMessage(`Account deleted successfully`);
  };

  return (
    <div className="container">
      <h1>User Accounts</h1>
      <Link to={`/user/${userId}/create-account`}>
        <button>Create a New Account</button>
      </Link>
      {loading && <p>Loading user accounts...</p>}
      {error && <p>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {accounts.length > 0 && (
        <div>
          <h2>Accounts List</h2>
          {accounts.map((account) => (
            <div key={account.id}>
              <h3>Account Name: {account.name}</h3>
              <h2>Balance: {account.balance}</h2>
              <h3>Created Date: {account.created_date}</h3>
              <DeleteAccount
                accountId={account.id}
                onDeleteSuccess={(deletedAccountId) => {
                console.log('Account deleted successfully:', deletedAccountId);
    
                }}
              />
              <EditAccountNameForm
                user_id={userId}
                account_id={account.id}
                currentName={account.account_name}
                onEdit={handleEditAccountName}
              />
              {/* Render the EditAccountNameForm for each account */}
              <TransactionForm
                userId={userId}
                accountId={account.id}
                onTransactionAdded={() => {
                  // Set success message for transaction
                  setSuccessMessage(`Transaction added successfully for account ${account.id}`);

                  // Clear success message after a few seconds
                  setTimeout(() => {
                    setSuccessMessage(null);
                  }, 3000);
                }}
              />
              {/* Display all transactions for the account */}
              {account.transactions && account.transactions.length > 0 && (
                <div>
                  <h3>Transactions List</h3>
                  {account.transactions.map((transaction) => (
                    <div key={transaction.id}>
                      <h3>Amount: {transaction.amount}</h3>
                      <h3>Description: {transaction.description}</h3>
                      <h3>Date: {transaction.transaction_date}</h3>
                      <button
                        onClick={() => handleDeleteTransaction(account.id, transaction.id)}
                        disabled={loading}
                      >
                        Delete Transaction
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAccountsPage;

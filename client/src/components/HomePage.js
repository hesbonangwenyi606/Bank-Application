// HomePage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 


const HomePage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <>
    
    <div className="container">
      

      <h1>Welcome to Vaulted Wealth</h1>

      

        <h2>Select Role:</h2>
        
        <button
            style={{ marginRight: '10px' }}
            onClick={() => setSelectedRole('user')}
          >
            <h2>User</h2>
          </button>

          <button
            style={{ marginLeft: '10px' }}
            onClick={() => setSelectedRole('admin')}
          >
            <h2>Admin</h2>
          </button>

      

      {selectedRole && (
        <div className="button-container">
          <h2>Select Action:</h2>

          {/* Conditionally render links based on the selected role */}
          {selectedRole === 'user' && (
            <>
              <Link to="/signup">
                <button className="left-button">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="right-button">Login</button>
              </Link>
            </>
          )}

          

          {selectedRole === 'admin' && (
            <>
              <Link to="/admin/signup">
                <button className="left-button">Admin Sign Up</button>
              </Link>
              <Link to="/admin/login">
                <button className="right-button">Admin Login</button>
              </Link>
              
            </>
            
          )}
        </div>
        
      )}
      {/* Container for displaying an image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
       <img
      src="https://images.pexels.com/photos/12920751/pexels-photo-12920751.jpeg?auto=compress&cs=tinysrgb&w=800"  
       style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
      />
      </div>

 
    </div>
    
    </>
  );
};

export default HomePage;

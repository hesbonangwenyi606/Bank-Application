
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <div>
      <h1>Our Services</h1>
      <h2>Explore the range of financial services we offer:</h2>
      
     
        <h3>Personal Account Management</h3>
        <h3>Business Account Solutions</h3>
        <h3>Secure Transactions</h3>
        <h3>Financial Planning</h3>
        
      {/* Container for displaying an image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
       <img
      src="https://images.pexels.com/photos/8353796/pexels-photo-8353796.jpeg?auto=compress&cs=tinysrgb&w=800"  
       style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
      />
      </div>

      <h2>Ready to take control of your finances?</h2>

      <div>
        <Link to="/login">
          <button>Sign In</button>
        </Link>
        <Link to="/signup">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;

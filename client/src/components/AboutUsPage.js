// AboutUsPage.js
import React from 'react';

const AboutUsPage = () => {
  return (
    <div>
      <h1>About Us</h1>
      <h2>Welcome to Vaulted Wealth, your trusted financial partner!</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
       <img
      src="https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1000"  
       style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }}
      />
      </div>

      <h2>
        At Vaulted Wealth, we are committed to providing exceptional financial services
        to individuals and businesses. Our mission is to empower our clients to achieve
        their financial goals with confidence and security.
      </h2>
      <h2>
        Our team consists of dedicated professionals with expertise in various financial
        domains. Whether you are a user managing personal accounts or an administrator
        overseeing multiple accounts, we've got you covered.
      </h2>
      <h2>
        Feel free to explore our services and features. If you have any questions or
        need assistance, our support team is always here to help.
      </h2>
    </div>
  );
};

export default AboutUsPage;

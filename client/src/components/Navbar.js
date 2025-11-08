import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="menu-toggle" onClick={handleToggle}>
        <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <ul className={isOpen ? 'open' : ''}>
        <li>
          <Link to="/"><i className="fas fa-home"></i>Home</Link>
        </li>
        <li>
          <Link to="/services"><i className="fas fa-chart-bar"></i>Services</Link>
        </li>
        <li>
          <Link to="/about-us"><i className="fas fa-building"></i>About Us</Link>
        </li>
        <li>
          <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

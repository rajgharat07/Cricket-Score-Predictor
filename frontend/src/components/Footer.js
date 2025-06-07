import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {year} Cricket Score Predictor. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
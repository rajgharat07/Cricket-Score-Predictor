import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Cricket Score Predictor
        </Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/predict" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Predict Score
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/history" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                History
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';

import './css/navbar.css';

export default function NavBar(props) {
  return(
    <nav className="navbar">
      <div className="container">
        <ul className="navbar-list">
          <li className="navbar-item"><Link to="/donnees" className="navbar-link">Modèles</Link></li>
        </ul>
      </div>
    </nav>
  );
}
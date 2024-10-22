// src/components/Sidebar.js

import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Sidebar.css'; // Ensure this CSS file exists

const Sidebar = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  if (!auth.user || auth.user.role !== 'user') {
    // Only show the sidebar for users with the 'user' role
    return null;
  }

  return (
    <div className="sidebar bg-light">
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/create-request"
          active={location.pathname === '/create-request'}
        >
          Create Waste Collection Request
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/view-requests"
          active={location.pathname === '/view-requests'}
        >
          View Waste Collection Requests
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;

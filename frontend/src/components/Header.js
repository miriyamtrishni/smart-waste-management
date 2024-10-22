// components/Header.js

import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('authData');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Smart Waste Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {auth.user ? (
              <>
                {auth.user.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">User Management</Nav.Link>
                    <Nav.Link as={Link} to="/admin/charts">View Charts</Nav.Link> {/* New Link */}
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  </>
                )}
                {auth.user.role === 'garbageCollector' && (
                  <>
                    <Nav.Link as={Link} to="/garbage-collector-dashboard">Garbage Collector Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/collector/assigned-users">Assigned Users</Nav.Link>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  </>
                )}
                {auth.user.role === 'user' && (
                  <>
                    <Nav.Link as={Link} to="/user-dashboard">User Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/user/invoices">View Invoices</Nav.Link>
                    <Nav.Link as={Link} to="/create-request">Request Waste Collection</Nav.Link>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  </>
                )}
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

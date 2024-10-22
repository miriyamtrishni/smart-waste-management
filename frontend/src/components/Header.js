// src/components/Header.js

import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';  // Import the CSS file here

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('authData');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-custom"
      fixed="top" // Fixes the navbar to the top
      variant="dark" // Ensures text is light
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeMobileMenu}>
          TrashMate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMobileMenu} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Aligns Nav links to the right */}
            {auth.user ? (
              <>
                {auth.user.role === 'admin' && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/admin-dashboard"
                      className={isActive('/admin-dashboard') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Admin Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/users"
                      className={isActive('/admin/users') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      User Management
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/charts"
                      className={isActive('/admin/charts') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      View Charts
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={isActive('/profile') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Nav.Link>
                  </>
                )}
                {auth.user.role === 'garbageCollector' && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/garbage-collector-dashboard"
                      className={isActive('/garbage-collector-dashboard') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Garbage Collector Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/collector/assigned-users"
                      className={isActive('/collector/assigned-users') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Assigned Users
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={isActive('/profile') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Nav.Link>
                  </>
                )}
                {auth.user.role === 'user' && (
                  <>
                    {/* Removed the User Dashboard link as per previous instructions */}
                    <Nav.Link
                      as={Link}
                      to="/user/invoices"
                      className={isActive('/user/invoices') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      View Invoices
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/create-request"
                      className={isActive('/create-request') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Request Waste Collection
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={isActive('/profile') ? 'active' : ''}
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={isActive('/login') ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={isActive('/register') ? 'active' : ''}
                  onClick={closeMobileMenu}
                >
                  Register
                </Nav.Link>
              </>
            )}
            {auth.user && (
              <Nav.Link className="logout-btn" onClick={() => { logout(); closeMobileMenu(); }}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

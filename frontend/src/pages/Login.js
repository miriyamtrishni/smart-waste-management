// frontend/src/pages/Login.js
import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Link to a CSS file for additional styling

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setAuth({ token: res.data.token, user: parseJwt(res.data.token) });
      // Redirect based on role
      const userRole = parseJwt(res.data.token).role;
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch(err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Function to parse JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Enter your credentials to access your account</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
              className="input-field"
            />
          </Form.Group>
          
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="password-container">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
                className="input-field"
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'} {/* Icon for toggling */}
              </span>
            </div>
          </Form.Group>
          
          <Button className="login-button" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;

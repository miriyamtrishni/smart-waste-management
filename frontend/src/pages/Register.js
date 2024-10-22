import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; // Import the new custom CSS

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    address: '',
    phoneNumber: ''
  });

  const [error, setError] = useState('');

  const { name, email, password, role, address, phoneNumber } = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setAuth({ token: res.data.token, user: parseJwt(res.data.token) });
      navigate('/');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        {error && <div className="alert-box">{error}</div>}
        <form onSubmit={onSubmit}>
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={onChange} 
            placeholder="Enter your name" 
            required 
            className="input-field"
          />
          
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            placeholder="Enter your email" 
            required 
            className="input-field"
          />
          
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            placeholder="Enter your password" 
            required 
            className="input-field"
          />

          <input 
            type="text" 
            name="address" 
            value={address} 
            onChange={onChange} 
            placeholder="Enter your address" 
            className="input-field"
          />

          <input 
            type="text" 
            name="phoneNumber" 
            value={phoneNumber} 
            onChange={onChange} 
            placeholder="Enter your phone number" 
            className="input-field"
          />
          
          <select 
            name="role" 
            value={role} 
            onChange={onChange} 
            className="select-field"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="garbageCollector">Garbage Collector</option>
          </select>
          
          <button className="register-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

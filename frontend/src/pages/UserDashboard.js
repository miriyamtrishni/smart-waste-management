// frontend/src/pages/UserDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const UserDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/dashboard');
        setMessage(res.data.message);
      } catch(err) {
        setMessage('Error fetching data');
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      <Card>
        <Card.Body>
          <Card.Text>{message}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserDashboard;

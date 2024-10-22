// src/components/WasteRequestForm.js

import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const WasteRequestForm = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    wasteItems: [
      { wasteType: 'food', weight: 0 },
      { wasteType: 'cardboard', weight: 0 },
      { wasteType: 'polythene', weight: 0 },
    ],
  });
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information.');
      }
    };
    fetchUserInfo();
  }, [auth.token]);

  // Handle weight changes
  const handleWeightChange = (e, wasteType) => {
    setError('');
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid positive number for weight.');
      return;
    }
    const newWasteItems = formData.wasteItems.map((waste) =>
      waste.wasteType === wasteType ? { ...waste, weight: value } : waste
    );
    setFormData({ ...formData, wasteItems: newWasteItems });
  };

  // Submit the request
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one waste item has a positive weight
    const hasPositiveWeight = formData.wasteItems.some((item) => item.weight > 0);
    if (!hasPositiveWeight) {
      setError('Please enter a positive weight for at least one waste type.');
      return;
    }

    // Calculate total price
    const priceMap = {
      food: 50, // LKR per kg
      cardboard: 100, // LKR per kg
      polythene: 150, // LKR per kg
    };

    let totalPrice = 0;
    const processedWasteItems = formData.wasteItems.map((item) => {
      const itemPrice = priceMap[item.wasteType] * item.weight;
      totalPrice += itemPrice;
      return { ...item, totalPrice: itemPrice };
    });

    const processedFormData = { wasteItems: processedWasteItems };

    // Store formData in localStorage for payment processing
    localStorage.setItem('pendingRequest', JSON.stringify(processedFormData));

    // Redirect to payment page
    navigate('/payment');
  };

  return (
    <div>
      <h2>Create Waste Collection Request</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* User Info Card */}
      <Card className="mb-4">
        <Card.Body>
          <h5>User Information</h5>
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {userInfo.phoneNumber}
          </p>
        </Card.Body>
      </Card>

      {/* Waste Request Form */}
      <Form onSubmit={onSubmit}>
        <h5>Enter Weights for Waste Types</h5>
        <Row className="mb-4">
          {formData.wasteItems.map((waste, index) => (
            <Col md={4} key={waste.wasteType}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {waste.wasteType.charAt(0).toUpperCase() + waste.wasteType.slice(1)} Waste
                  </Card.Title>
                  <Form.Group controlId={`weight-${waste.wasteType}`}>
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.1"
                      value={waste.weight}
                      onChange={(e) => handleWeightChange(e, waste.wasteType)}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Button variant="primary" type="submit">
          Proceed to Payment
        </Button>
      </Form>
    </div>
  );
};

export default WasteRequestForm;
 
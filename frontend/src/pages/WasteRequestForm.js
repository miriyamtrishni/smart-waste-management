import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const WasteRequestForm = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    wasteItems: [
      { wasteType: 'food', packageSize: 'small', quantity: 1 },
      { wasteType: 'cardboard', packageSize: 'small', quantity: 1 },
      { wasteType: 'polythene', packageSize: 'small', quantity: 1 },
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
        setUserInfo(res.data); // Auto-fill user info like name, email, phoneNumber
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, [auth.token]);

  // Handle package size changes
  const handleSizeChange = (e, wasteType) => {
    const newWasteItems = formData.wasteItems.map((waste) =>
      waste.wasteType === wasteType ? { ...waste, packageSize: e.target.value } : waste
    );
    setFormData({ ...formData, wasteItems: newWasteItems });
  };

  // Submit the request
  const onSubmit = async (e) => {
    e.preventDefault();

    // Store formData in localStorage or state management
    // For simplicity, we'll use localStorage here
    localStorage.setItem('pendingRequest', JSON.stringify(formData));

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
        <h5>Select Waste Types and Sizes</h5>
        <Row className="mb-4">
          {formData.wasteItems.map((waste, index) => (
            <Col md={4} key={waste.wasteType}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {waste.wasteType.charAt(0).toUpperCase() + waste.wasteType.slice(1)} Waste
                  </Card.Title>
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      name={`${waste.wasteType}-size`}
                      label="Small"
                      value="small"
                      checked={waste.packageSize === 'small'}
                      onChange={(e) => handleSizeChange(e, waste.wasteType)}
                    />
                    <Form.Check
                      type="radio"
                      name={`${waste.wasteType}-size`}
                      label="Medium"
                      value="medium"
                      checked={waste.packageSize === 'medium'}
                      onChange={(e) => handleSizeChange(e, waste.wasteType)}
                    />
                    <Form.Check
                      type="radio"
                      name={`${waste.wasteType}-size`}
                      label="Large"
                      value="large"
                      checked={waste.packageSize === 'large'}
                      onChange={(e) => handleSizeChange(e, waste.wasteType)}
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
 
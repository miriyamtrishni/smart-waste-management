import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Button, Card, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { auth } = useContext(AuthContext);
  const [requestData, setRequestData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch request data from localStorage or state management
  useEffect(() => {
    const data = localStorage.getItem('pendingRequest');
    if (data) {
      const parsedData = JSON.parse(data);
      setRequestData(parsedData);
      calculateTotalPrice(parsedData.wasteItems);
    } else {
      // If no data, redirect back to request form
      navigate('/request-form');
    }
  }, [navigate]);

  const calculateTotalPrice = (wasteItems) => {
    const priceMap = {
      food: 50,
      cardboard: 100,
      polythene: 150,
    };
    const multiplier = { small: 2, medium: 4, large: 8 };

    let total = 0;
    wasteItems.forEach((item) => {
      const itemPrice = priceMap[item.wasteType] * multiplier[item.packageSize] * item.quantity;
      total += itemPrice;
    });
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    // Simulate payment process
    try {
      // After payment is successful, send data to backend
      const res = await axios.post(
        'http://localhost:5000/api/request/create',
        requestData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setPaymentSuccess(true);
      // Clear the pending request from localStorage
      localStorage.removeItem('pendingRequest');

      // Redirect to a success page or display a success message
      navigate(`/invoice/${res.data._id}`);
    } catch (err) {
      setError('Payment failed or error creating request');
      console.error('Error processing payment:', err);
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {requestData && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h5>Confirm Your Waste Collection Request</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Waste Type</th>
                    <th>Package Size</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData.wasteItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.wasteType}</td>
                      <td>{item.packageSize}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h5>Total Price: {totalPrice} LKR</h5>
              <Button variant="success" onClick={handlePayment}>
                Confirm and Pay
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default PaymentPage;

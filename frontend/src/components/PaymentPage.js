// src/components/PaymentPage.js

import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Button, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Custom styling for CardElement
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

// CheckoutForm Component
const CheckoutForm = ({ requestData, totalPrice, onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create a Payment Intent on the backend
      const paymentIntentRes = await axios.post(
        'http://localhost:5000/api/stripe/create-payment-intent',
        {
          wasteItems: requestData.wasteItems,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      const clientSecret = paymentIntentRes.data.clientSecret;

      // Confirm the payment on the frontend
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        // Show error to your customer (e.g., insufficient funds)
        setError(paymentResult.error.message);
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          // Payment succeeded, send request data to the backend
          await axios.post(
            'http://localhost:5000/api/request/create',
            {
              wasteItems: requestData.wasteItems,
              totalPrice: totalPrice,
              paymentIntentId: paymentResult.paymentIntent.id,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

          // Clear the pending request from localStorage
          localStorage.removeItem('pendingRequest');

          // Redirect to the request form after successful payment
          onSuccessfulPayment();
        }
      }
    } catch (err) {
      console.error('Error during payment:', err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-3 mb-3">
        <Card.Title>Enter Payment Details</Card.Title>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Card>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" type="submit" disabled={!stripe || processing}>
        {processing ? <Spinner animation="border" size="sm" /> : 'Pay'}
      </Button>
    </form>
  );
};

// PaymentPage Component
const PaymentPage = () => {
  const { auth } = useContext(AuthContext);
  const [requestData, setRequestData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
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
      food: 50, // LKR per kg
      cardboard: 100, // LKR per kg
      polythene: 150, // LKR per kg
    };

    let total = 0;
    const processedWasteItems = wasteItems.map((item) => {
      const itemPrice = priceMap[item.wasteType] * item.weight;
      total += itemPrice;
      return { ...item, totalPrice: itemPrice };
    });
    setTotalPrice(total);
    setRequestData({ ...wasteItems, wasteItems: processedWasteItems });
  };

  const handleSuccessfulPayment = () => {
    // Redirect to the request form after successful payment and request creation
    navigate('/request-form');
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
                    <th>Weight (kg)</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData.wasteItems.map((item, index) => (
                    item.weight > 0 && (
                      <tr key={index}>
                        <td>
                          {item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)}
                        </td>
                        <td>{item.weight}</td>
                        <td>{item.totalPrice} LKR</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </Table>
              <h5>Total Price: {totalPrice} LKR</h5>
            </Card.Body>
          </Card>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              requestData={requestData}
              totalPrice={totalPrice}
              onSuccessfulPayment={handleSuccessfulPayment}
            />
          </Elements>
        </>
      )}
    </div>
  );
};

export default PaymentPage;

// src/pages/RequestDetails.js

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import '../styles/RequestDetails.css';

const RequestDetails = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(`/api/request/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setRequest(response.data);
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('Failed to fetch request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, auth.token]);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!request) {
    return <Alert variant="warning">Request not found.</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Waste Collection Request Details</Card.Title>
        <Card.Text><strong>Request ID:</strong> {request._id}</Card.Text>
        <Card.Text><strong>Date Requested:</strong> {new Date(request.createdAt).toLocaleDateString()}</Card.Text> {/* Use createdAt instead of dateRequested */}
        <Card.Text><strong>Status:</strong> {request.status}</Card.Text>
        <Card.Text><strong>Payment Status:</strong> {request.paymentStatus}</Card.Text>
        <Card.Text><strong>Total Price:</strong> LKR {request.totalPrice}</Card.Text>
        <Card.Text><strong>Assigned Collector:</strong> {request.assignedCollector ? request.assignedCollector.name : 'N/A'}</Card.Text>
        <Card.Text><strong>Scheduled Date:</strong> {request.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : 'N/A'}</Card.Text>
        
        <h5>Waste Items:</h5>
        <ul>
          {request.wasteItems.map((item, index) => (
            <li key={index}>
              {item.wasteType} - {item.weight} kg
            </li>
          ))}
        </ul>

        <Button variant="secondary" href="/view-requests">Back to Requests</Button>
      </Card.Body>
    </Card>
  );
};

export default RequestDetails;

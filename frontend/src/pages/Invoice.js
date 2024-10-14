import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Invoice = () => {
  const { id } = useParams(); // Get request ID from URL params
  const [request, setRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/request/${id}`);
        setRequest(res.data);
      } catch (err) {
        console.error('Error fetching request data:', err);
      }
    };
    fetchRequest();
  }, [id]);

  if (!request) return <p>Loading...</p>;

  return (
    <div>
      <h2>Invoice</h2>
      <Card className="mb-4">
        <Card.Body>
          <h5>Customer Information</h5>
          <p><strong>Name:</strong> {request.user.name}</p>
          <p><strong>Email:</strong> {request.user.email}</p>
          <p><strong>Phone:</strong> {request.user.phoneNumber}</p>
        </Card.Body>
      </Card>

      <h5>Waste Request Summary</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Waste Type</th>
            <th>Package Size</th>
            <th>Price (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {request.wasteItems.map((waste, index) => (
            <tr key={index}>
              <td>{waste.wasteType}</td>
              <td>{waste.packageSize}</td>
              <td>{waste.totalPrice} LKR</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5>Total Price: {request.totalPrice} LKR</h5>

      <Button onClick={() => navigate('/user-dashboard')}>Go to Dashboard</Button>
    </div>
  );
};

export default Invoice;

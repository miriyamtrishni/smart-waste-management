// components/GarbageCollectorDashboard.js

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GarbageCollectorDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/request/collector/assigned-requests', {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Include token for authentication
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching assigned requests:', err);
        setError('Failed to fetch assigned requests.');
      }
    };

    fetchAssignedRequests();
  }, [auth.token]);

  // Function to mark a request as completed
  const markAsCompleted = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/request/collector/complete/${requestId}`,
        {}, // No body needed as per backend implementation
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // Update the local state to reflect the status change
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: 'completed' } : req
        )
      );
      setError('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update request status.');
    }
  };

  return (
    <div>
      <h2>Garbage Collector Dashboard</h2>

      {/* Display error messages if any */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Waste Items</th> {/* Combined column for waste items */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No assigned requests found.
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req.user.name}</td>
                <td>
                  {/* Nested Table for Waste Items */}
                  <Table size="sm" bordered>
                    <thead>
                      <tr>
                        <th>Waste Type</th>
                        <th>Weight (kg)</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.wasteItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            {item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)}
                          </td>
                          <td>{item.weight}</td>
                          <td>{item.totalPrice} LKR</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                <td>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</td>
                <td>
                  {req.status !== 'completed' ? (
                    <Button
                      variant="success"
                      onClick={() => markAsCompleted(req._id)}
                    >
                      Mark as Completed
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      Completed
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GarbageCollectorDashboard;

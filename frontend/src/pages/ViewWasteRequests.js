// src/pages/ViewWasteRequests.js

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import '../styles/ViewWasteRequests.css'; // Optional: Create this CSS file for custom styles

const ViewWasteRequests = () => {
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state for viewing request details
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request/user/my-requests', { // Correct API URL
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching user requests:', err);
        setError('Failed to fetch your waste collection requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, [auth.token]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="view-requests-container">
      <h2>My Waste Collection Requests</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : requests.length === 0 ? (
        <p>You have not made any waste collection requests yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Date Requested</th>
              <th>Status</th>
              <th>Scheduled Date</th>
              <th>Total Price (LKR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{capitalizeFirstLetter(request.status)}</td>
                <td>
                  {request.scheduledDate
                    ? new Date(request.scheduledDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{request.totalPrice.toLocaleString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal to show request details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Waste Collection Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p><strong>Request ID:</strong> {selectedRequest._id}</p>
              <p><strong>Status:</strong> {capitalizeFirstLetter(selectedRequest.status)}</p>
              <p><strong>Date Requested:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
              <p><strong>Scheduled Date:</strong> {selectedRequest.scheduledDate ? new Date(selectedRequest.scheduledDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Total Price:</strong> {selectedRequest.totalPrice.toLocaleString()} LKR</p>
              <p><strong>Payment Status:</strong> {selectedRequest.paymentStatus}</p>
              <hr />
              <h5>Waste Items:</h5>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Waste Type</th>
                    <th>Weight (kg)</th>
                    <th>Price (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRequest.wasteItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{capitalizeFirstLetter(item.wasteType)}</td>
                      <td>{item.weight}</td>
                      {/* Ensure the price is calculated correctly */}
                      <td>{(item.weight * item.pricePerKg).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {selectedRequest.assignedCollector && (
                <>
                  <hr />
                  <p><strong>Assigned Garbage Collector:</strong> {selectedRequest.assignedCollector.name}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ViewWasteRequests;

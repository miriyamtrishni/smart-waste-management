import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import '../styles/ViewWasteRequests.css'; // Create this CSS file for custom styles

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
        const response = await axios.get('http://localhost:5000/api/request/user/my-requests', {
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
        <div className="loading-container">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : requests.length === 0 ? (
        <p>You have not made any waste collection requests yet.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date Requested</th>
              <th>Status</th>
              <th>Assigned Garbage Collector</th> {/* Changed from "Scheduled Date" */}
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
                  {request.assignedCollector
                    ? request.assignedCollector.name
                    : 'Not Assigned'} {/* Display assigned collector name */}
                </td>
                <td>{request.totalPrice.toLocaleString()}</td>
                <td>
                  <button
                    className="view-details-button"
                    onClick={() => handleViewDetails(request)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal to show request details */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Waste Collection Request Details</h4>
              <button className="close-modal-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {selectedRequest && (
                <>
                  <p><strong>Request ID:</strong> {selectedRequest._id}</p>
                  <p><strong>Status:</strong> {capitalizeFirstLetter(selectedRequest.status)}</p>
                  <p><strong>Date Requested:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total Price:</strong> {selectedRequest.totalPrice.toLocaleString()} LKR</p>
                  <p><strong>Payment Status:</strong> {selectedRequest.paymentStatus}</p>
                  <hr />
                  <h5>Waste Items:</h5>
                  <table className="custom-table small">
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
                          <td>{(item.weight * item.pricePerKg).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedRequest.assignedCollector && (
                    <>
                      <hr />
                      <p><strong>Assigned Garbage Collector:</strong> {selectedRequest.assignedCollector.name}</p>
                    </>
                  )}
                </>
              )}
            </div>
            {/* <div className="modal-footer">
              <button className="close-modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ViewWasteRequests;

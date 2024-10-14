// components/AdminDashboard.js

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [garbageCollectors, setGarbageCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [editing, setEditing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/request/admin/requests', {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Include token if required
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    const fetchGarbageCollectors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/garbage-collectors', {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Include token if required
          },
        });
        setGarbageCollectors(res.data);
      } catch (err) {
        console.error('Error fetching collectors:', err);
      }
    };

    fetchRequests();
    fetchGarbageCollectors();
  }, [auth.token]);

  const assignCollector = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/request/admin/assign/${requestId}`,
        {
          collectorId: selectedCollector[requestId],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // Reload requests after assigning
      const res = await axios.get('http://localhost:5000/api/request/admin/requests', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRequests(res.data);
      setEditing({ ...editing, [requestId]: false }); // Close editing mode
    } catch (err) {
      console.error('Error assigning collector:', err);
    }
  };

  const handleCollectorChange = (e, requestId) => {
    setSelectedCollector({
      ...selectedCollector,
      [requestId]: e.target.value,
    });
  };

  const deleteRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/request/${requestId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // Refresh requests after deletion
      const res = await axios.get('http://localhost:5000/api/request/admin/requests', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  const filteredRequests = showCompleted
    ? requests.filter((req) => req.status === 'completed')
    : requests.filter((req) => req.status !== 'completed');

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Buttons to toggle between assigned and completed requests */}
      <Row className="mb-4">
        <Col>
          <Button
            variant={!showCompleted ? 'primary' : 'secondary'}
            onClick={() => setShowCompleted(false)}
            className="w-100"
          >
            Assign Requests
          </Button>
        </Col>
        <Col>
          <Button
            variant={showCompleted ? 'primary' : 'secondary'}
            onClick={() => setShowCompleted(true)}
            className="w-100"
          >
            Completed Requests
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Waste Items</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Assigned Collector</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((req) => (
            <tr key={req._id}>
              <td>{req.user.name}</td>
              <td>
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Waste Type</th>
                      <th>Package Size</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {req.wasteItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.wasteType}</td>
                        <td>{item.packageSize}</td>
                        <td>{item.quantity}</td>
                        <td>{item.totalPrice} LKR</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>{req.totalPrice} LKR</td>
              <td>{req.status}</td>
              <td>
                {editing[req._id] ? (
                  <Form.Select
                    value={selectedCollector[req._id] || ''}
                    onChange={(e) => handleCollectorChange(e, req._id)}
                  >
                    <option value="">Select Collector</option>
                    {garbageCollectors.map((collector) => (
                      <option key={collector._id} value={collector._id}>
                        {collector.name}
                      </option>
                    ))}
                  </Form.Select>
                ) : req.assignedCollector ? (
                  req.assignedCollector.name
                ) : (
                  'Not Assigned'
                )}
              </td>
              <td>
                {req.status === 'completed' ? (
                  <Button variant="danger" onClick={() => deleteRequest(req._id)}>
                    Delete
                  </Button>
                ) : editing[req._id] ? (
                  <Button
                    className="mt-2"
                    onClick={() => assignCollector(req._id)}
                    disabled={!selectedCollector[req._id]}
                  >
                    Save
                  </Button>
                ) : req.assignedCollector ? (
                  <Button
                    variant="warning"
                    onClick={() => setEditing({ ...editing, [req._id]: true })}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Form.Select
                      value={selectedCollector[req._id] || ''}
                      onChange={(e) => handleCollectorChange(e, req._id)}
                    >
                      <option value="">Select Collector</option>
                      {garbageCollectors.map((collector) => (
                        <option key={collector._id} value={collector._id}>
                          {collector.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      onClick={() => assignCollector(req._id)}
                      className="mt-2"
                      disabled={!selectedCollector[req._id]}
                    >
                      Assign
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;

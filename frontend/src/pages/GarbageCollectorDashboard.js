import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';

const GarbageCollectorDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchAssignedRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/request/collector/assigned-requests');
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching assigned requests:', err);
      }
    };

    fetchAssignedRequests();
  }, []);

  const updateStatus = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/request/collector/complete/${requestId}`, {
        status,
      });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: 'completed' } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div>
      <h2>Garbage Collector Dashboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Waste Items</th> {/* Combined column for waste items */}
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.user.name}</td>
              <td>
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Waste Type & Package Size</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {req.wasteItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.wasteType} - {item.packageSize}</td>
                        <td>{item.quantity}</td>
                        <td>{item.totalPrice} LKR</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </td>
              <td>{req.status}</td>
              <td>
                {req.status !== 'completed' ? (
                  <Form.Select
                    value={req.status}
                    onChange={(e) => updateStatus(req._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                ) : (
                  <Button variant="secondary" disabled>
                    Completed
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GarbageCollectorDashboard;

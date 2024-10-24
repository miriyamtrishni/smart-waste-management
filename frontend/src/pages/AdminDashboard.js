import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Add your custom CSS file here

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [garbageCollectors, setGarbageCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [editing, setEditing] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/request/admin/requests', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests.');
      }
    };

    const fetchGarbageCollectors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/garbage-collectors', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setGarbageCollectors(res.data);
      } catch (err) {
        console.error('Error fetching collectors:', err);
        setError('Failed to fetch garbage collectors.');
      }
    };

    fetchRequests();
    fetchGarbageCollectors();
  }, [auth.token]);

  const assignCollector = async (requestId) => {
    try {
      if (!selectedCollector[requestId]) {
        setError('Please select a garbage collector.');
        return;
      }

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
      setEditing({ ...editing, [requestId]: false });
      setSelectedCollector({ ...selectedCollector, [requestId]: '' });
      setError('');
    } catch (err) {
      console.error('Error assigning collector:', err);
      setError('Failed to assign collector.');
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
      setError('');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete request.');
    }
  };

  const filteredRequests = showCompleted
    ? requests.filter((req) => req.status === 'completed')
    : requests.filter((req) => req.status !== 'completed');

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-header">Admin Dashboard</h2>
      <p className="admin-dashboard-subtitle">Manage waste collection requests</p>

      {error && <div className="error-alert">{error}</div>}

      <div className="admin-dashboard-button-row">
        <button
          className={`admin-dashboard-button ${!showCompleted ? 'active' : ''}`}
          onClick={() => setShowCompleted(false)}
        >
          Assign Requests
        </button>
        <button
          className={`admin-dashboard-button ${showCompleted ? 'active' : ''}`}
          onClick={() => setShowCompleted(true)}
        >
          Completed Requests
        </button>
      </div>

      <table className="table">
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
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="6" className="table-empty">No requests found.</td>
            </tr>
          ) : (
            filteredRequests.map((req) => (
              <tr key={req._id}>
                <td>{req.user.name}</td>
                <td>
                  <table className="sub-table">
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
                          <td>{item.wasteType}</td>
                          <td>{item.weight}</td>
                          <td>{item.totalPrice} LKR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{req.totalPrice} LKR</td>
                <td>{req.status}</td>
                <td>
                  {editing[req._id] ? (
                    <select
                      className="collector-dropdown"
                      value={selectedCollector[req._id] || ''}
                      onChange={(e) => handleCollectorChange(e, req._id)}
                    >
                      <option value="">Select Collector</option>
                      {garbageCollectors.map((collector) => (
                        <option key={collector._id} value={collector._id}>
                          {collector.name}
                        </option>
                      ))}
                    </select>
                  ) : req.assignedCollector ? (
                    req.assignedCollector.name
                  ) : (
                    'Not Assigned'
                  )}
                </td>
                <td>
                  {req.status === 'completed' ? (
                    <button className="delete-btn" onClick={() => deleteRequest(req._id)}>
                      Delete
                    </button>
                  ) : editing[req._id] ? (
                    <button
                      className="assign-btn"
                      onClick={() => assignCollector(req._id)}
                      disabled={!selectedCollector[req._id]}
                    >
                      Save
                    </button>
                  ) : req.assignedCollector ? (
                    <button
                      className="edit-btn"
                      onClick={() => setEditing({ ...editing, [req._id]: true })}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <select
                        className="collector-dropdown"
                        value={selectedCollector[req._id] || ''}
                        onChange={(e) => handleCollectorChange(e, req._id)}
                      >
                        <option value="">Select Collector</option>
                        {garbageCollectors.map((collector) => (
                          <option key={collector._id} value={collector._id}>
                            {collector.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="assign-btn"
                        onClick={() => assignCollector(req._id)}
                        disabled={!selectedCollector[req._id]}
                        style={{ backgroundColor: '#198754', color: 'white' }}
                      >
                        Assign
                      </button>

                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

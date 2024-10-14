// components/AdminUserManagement.js

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

const AdminUserManagement = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState({});

  useEffect(() => {
    const fetchUsersAndCollectors = async () => {
      try {
        const [usersRes, collectorsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${auth.token}` },
          }),
          axios.get('http://localhost:5000/api/auth/garbage-collectors', {
            headers: { Authorization: `Bearer ${auth.token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setCollectors(collectorsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchUsersAndCollectors();
  }, [auth.token]);

  const assignCollector = async (userId) => {
    try {
      await axios.put(
        'http://localhost:5000/api/admin/assign-collector',
        {
          userId,
          collectorId: selectedCollector[userId],
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, assignedCollector: collectors.find((c) => c._id === selectedCollector[userId]) } : user
        )
      );
      setSelectedCollector({ ...selectedCollector, [userId]: '' });
    } catch (err) {
      console.error('Error assigning collector:', err);
    }
  };

  const generateInvoice = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/admin/generate-invoice/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert('Invoice generated successfully');
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert(err.response?.data?.message || 'Error generating invoice');
    }
  };

  return (
    <div>
      <h2>Admin - User Management</h2>
      <h3>Users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Assigned Collector</th>
            <th>Assign Collector</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.assignedCollector ? user.assignedCollector.name : 'Not Assigned'}</td>
              <td>
                <Form.Select
                  value={selectedCollector[user._id] || ''}
                  onChange={(e) => setSelectedCollector({ ...selectedCollector, [user._id]: e.target.value })}
                >
                  <option value="">Select Collector</option>
                  {collectors.map((collector) => (
                    <option key={collector._id} value={collector._id}>
                      {collector.name}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="primary"
                  onClick={() => assignCollector(user._id)}
                  disabled={!selectedCollector[user._id]}
                  className="mt-2"
                >
                  Assign
                </Button>
              </td>
              <td>
                <Button variant="success" onClick={() => generateInvoice(user._id)}>
                  Generate Invoice
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUserManagement;

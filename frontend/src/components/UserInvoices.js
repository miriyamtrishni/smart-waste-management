// components/UserInvoices.js

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const UserInvoices = () => {
  const { auth } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/invoices', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setInvoices(res.data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    };

    fetchInvoices();
  }, [auth.token]);

  return (
    <div>
      <h2>Your Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        invoices.map((invoice) => (
          <div key={invoice._id} className="mb-4">
            <h5>
              Invoice for {new Date(invoice.periodStart).toLocaleDateString()} -{' '}
              {new Date(invoice.periodEnd).toLocaleDateString()}
            </h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Waste Type</th>
                  <th>Total Weight (kg)</th>
                  <th>Rate per kg (LKR)</th>
                  <th>Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.wasteDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.wasteType}</td>
                    <td>{detail.totalWeight}</td>
                    <td>{detail.ratePerKg}</td>
                    <td>{detail.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5>Total Amount: {invoice.totalAmount} LKR</h5>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default UserInvoices;

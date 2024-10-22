import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/WasteRequestForm.css'; // Link to custom CSS

const WasteRequestForm = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    wasteItems: [
      { wasteType: 'food', weight: 0 },
      { wasteType: 'cardboard', weight: 0 },
      { wasteType: 'polythene', weight: 0 },
    ],
  });
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information.');
      }
    };
    fetchUserInfo();
  }, [auth.token]);

  // Handle weight changes
  const handleWeightChange = (e, wasteType) => {
    setError('');
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid positive number for weight.');
      return;
    }
    const newWasteItems = formData.wasteItems.map((waste) =>
      waste.wasteType === wasteType ? { ...waste, weight: value } : waste
    );
    setFormData({ ...formData, wasteItems: newWasteItems });
  };

  // Submit the request
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one waste item has a positive weight
    const hasPositiveWeight = formData.wasteItems.some((item) => item.weight > 0);
    if (!hasPositiveWeight) {
      setError('Please enter a positive weight for at least one waste type.');
      return;
    }

    // Calculate total price
    const priceMap = {
      food: 50, // LKR per kg
      cardboard: 100, // LKR per kg
      polythene: 150, // LKR per kg
    };

    let totalPrice = 0;
    const processedWasteItems = formData.wasteItems.map((item) => {
      const itemPrice = priceMap[item.wasteType] * item.weight;
      totalPrice += itemPrice;
      return { ...item, totalPrice: itemPrice };
    });

    const processedFormData = { wasteItems: processedWasteItems };

    // Store formData in localStorage for payment processing
    localStorage.setItem('pendingRequest', JSON.stringify(processedFormData));

    // Redirect to payment page
    navigate('/payment');
  };

  return (
    <div className="waste-request-container">
      <h2 className="title">Create Waste Collection Request</h2>
      {error && <div className="error-message">{error}</div>}

      {/* User Info Section */}
      <div className="user-info-card">
        <h5>User Information</h5>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Phone:</strong> {userInfo.phoneNumber}</p>
      </div>

      {/* Waste Request Form */}
      <form onSubmit={onSubmit} className="waste-form">
        <h5>Enter Weights for Waste Types</h5>
        <div className="waste-items-grid">
          {formData.wasteItems.map((waste) => (
            <div key={waste.wasteType} className="waste-item-card">
              <h3>{waste.wasteType.charAt(0).toUpperCase() + waste.wasteType.slice(1)} Waste</h3>
              <label htmlFor={`weight-${waste.wasteType}`}>Weight (kg)</label>
              <input
                type="number"
                id={`weight-${waste.wasteType}`}
                min="0"
                step="0.1"
                value={waste.weight}
                onChange={(e) => handleWeightChange(e, waste.wasteType)}
                required
                className="weight-input"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default WasteRequestForm;

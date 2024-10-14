// components/GarbageCollectionForm.js

import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const GarbageCollectionForm = ({ user, onClose }) => {
  const { auth } = useContext(AuthContext);
  const [wasteData, setWasteData] = useState([{ wasteType: 'food', weight: 0 }]);

  const handleAddWasteType = () => {
    setWasteData([...wasteData, { wasteType: 'food', weight: 0 }]);
  };

  const handleWasteDataChange = (index, field, value) => {
    const newWasteData = [...wasteData];
    newWasteData[index][field] = value;
    setWasteData(newWasteData);
  };

  const handleSubmitGarbageCollection = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/collector/collect-garbage/${user._id}`,
        { wasteData },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert('Garbage collection recorded');
      onClose();
    } catch (err) {
      console.error('Error recording garbage collection:', err);
      alert('Error recording garbage collection');
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Record Garbage Collection for {user?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {wasteData.map((data, index) => (
          <div key={index} className="mb-3">
            <Form.Group>
              <Form.Label>Waste Type</Form.Label>
              <Form.Select
                value={data.wasteType}
                onChange={(e) => handleWasteDataChange(index, 'wasteType', e.target.value)}
              >
                <option value="food">Food Waste</option>
                <option value="cardboard">Cardboard</option>
                <option value="polythene">Polythene</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                value={data.weight}
                onChange={(e) => handleWasteDataChange(index, 'weight', e.target.value)}
              />
            </Form.Group>
          </div>
        ))}
        <Button variant="secondary" onClick={handleAddWasteType}>
          Add More Waste Type
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitGarbageCollection}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GarbageCollectionForm;

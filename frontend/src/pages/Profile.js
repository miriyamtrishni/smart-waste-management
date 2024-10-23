import React, { useState, useEffect, useContext } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase'; // Import Firebase storage
import { Form, Button, ProgressBar, Alert, Card, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        setError('Error fetching user info');
      }
    };
    fetchUserInfo();
  }, [auth.token]);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    const storageRef = ref(storage, `profile-photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError('Error uploading the file: ' + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setError('');
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = { ...userInfo, profilePicUrl: downloadURL };
      const res = await axios.put('http://localhost:5000/api/auth/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError('Error updating profile');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Profile Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">User Information</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Label>Upload Profile Photo</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            {/* Display Uploaded Image */}
            {downloadURL && (
              <div className="text-center mt-4">
                <img
                  src={downloadURL}
                  alt="Uploaded profile"
                  className="img-fluid rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <ProgressBar now={uploadProgress} label={`${Math.round(uploadProgress)}%`} className="mt-3" />
            )}

            {/* Buttons aligned to the right */}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" onClick={handleUpload} className="me-2">
                Upload Photo
              </Button>
              <Button type="submit" variant="success">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;

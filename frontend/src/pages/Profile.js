// src/pages/Profile.js
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase"; // Import Firebase storage
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    const storageRef = ref(storage, `profile-photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen to upload state changes
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError("Error uploading the file: " + error.message);
      },
      () => {
        // Get the download URL once upload completes
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setError("");
        });
      }
    );
  };

  return (
    <div>
      <h2>Profile Page</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {downloadURL && <Alert variant="success">File uploaded successfully! <a href={downloadURL} target="_blank" rel="noopener noreferrer">View Image</a></Alert>}

      <Form>
        <Form.Group controlId="fileUpload" className="mb-3">
          <Form.Label>Upload Profile Photo</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" onClick={handleUpload}>Upload</Button>

        {uploadProgress > 0 && (
          <ProgressBar now={uploadProgress} label={`${Math.round(uploadProgress)}%`} className="mt-3" />
        )}
      </Form>

      {downloadURL && <img src={downloadURL} alt="Uploaded profile" className="mt-4" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} />}
    </div>
  );
};

export default Profile;

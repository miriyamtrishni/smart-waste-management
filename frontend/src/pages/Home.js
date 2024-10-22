// frontend/src/pages/Home.js
import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';

const Home = () => (
  <Container>
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">TrashMate</h1>
        <p className="col-md-8 fs-4">Efficiently manage and monitor waste collection with our smart system.</p>
      </div>
    </div>
  </Container>
);

export default Home;

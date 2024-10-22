// src/components/WasteCollectionLayout.js

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar'; // Ensure Sidebar is correctly imported
import '../styles/WasteCollectionLayout.css'; // Optional: Create this CSS file for custom styles

const WasteCollectionLayout = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default WasteCollectionLayout;

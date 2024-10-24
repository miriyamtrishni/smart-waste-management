import React from 'react';
import { Container, Form, Button, Nav } from 'react-bootstrap'; // Import the necessary components

export default function Footer() {
  return (
    <footer className="bg-light py-3">
      {/* Subscription Section */}
      <section className="py-5 bg-success text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Transform Your Waste Management?</h2>
          <p className="mb-4">
            Join the smart waste revolution and create a cleaner, more efficient city.
          </p>
          <Form className="d-flex justify-content-center mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              className="me-2"
              style={{ maxWidth: '300px' }}
            />
            <Button variant="light">Subscribe</Button>
          </Form>
          <small>
            Get updates on our latest features and releases. By subscribing, you agree to our Terms & Privacy Policy.
          </small>
        </Container>
      </section>

      {/* Footer links and copyright */}
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <small className="text-muted">© 2024 TrashMate. All rights reserved.</small>
        <Nav className="mt-2 mt-md-0">
          <Nav.Link href="#" className="text-muted">Terms of Service</Nav.Link>
          <Nav.Link href="#" className="text-muted">Privacy</Nav.Link>
        </Nav>
      </Container>
    </footer>
  );
}

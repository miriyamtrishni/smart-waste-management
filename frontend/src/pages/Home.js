// frontend/src/pages/Home.js
import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Form } from 'react-bootstrap';
import { Recycle, Truck, BarChart3, Leaf, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Content */}
      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="py-5 bg-light">
          <Container className="text-center">
            <h1 className="display-4 fw-bold">Smart Waste Management</h1>
            <p className="lead text-muted">
              Revolutionize your city's waste management with our IoT-powered smart solutions. Efficient, sustainable, and cost-effective.
            </p>
            <div className="mt-4">
              <Button variant="success" className="me-2">Get Started</Button>
              <Button variant="outline-success">Learn More</Button>
            </div>
          </Container>
        </section>

        {/* Key Features */}
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5">Key Features</h2>
            <Row>
              <Col md={4} className="text-center mb-4">
                <Truck size={48} className="text-success mb-3" />
                <h4>Smart Collection</h4>
                <p className="text-muted">
                  Optimize waste collection routes with real-time bin fill level monitoring.
                </p>
              </Col>
              <Col md={4} className="text-center mb-4">
                <BarChart3 size={48} className="text-success mb-3" />
                <h4>Data Analytics</h4>
                <p className="text-muted">
                  Gain insights from waste data to improve city cleanliness and efficiency.
                </p>
              </Col>
              <Col md={4} className="text-center mb-4">
                <Leaf size={48} className="text-success mb-3" />
                <h4>Eco-Friendly</h4>
                <p className="text-muted">
                  Reduce carbon emissions and promote sustainable waste management practices.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Benefits */}
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center mb-5">Benefits</h2>
            <Row>
              <Col md={6} className="mb-4">
                <div className="d-flex align-items-start">
                  <ArrowRight size={24} className="text-success me-3" />
                  <div>
                    <h5>Cost Reduction</h5>
                    <p className="text-muted">
                      Optimize collection routes and reduce operational costs by up to 30%.
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={6} className="mb-4">
                <div className="d-flex align-items-start">
                  <ArrowRight size={24} className="text-success me-3" />
                  <div>
                    <h5>Improved Cleanliness</h5>
                    <p className="text-muted">
                      Prevent overflowing bins and maintain a cleaner urban environment.
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={6} className="mb-4">
                <div className="d-flex align-items-start">
                  <ArrowRight size={24} className="text-success me-3" />
                  <div>
                    <h5>Environmental Impact</h5>
                    <p className="text-muted">
                      Reduce carbon emissions and promote recycling initiatives.
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={6} className="mb-4">
                <div className="d-flex align-items-start">
                  <ArrowRight size={24} className="text-success me-3" />
                  <div>
                    <h5>Smart City Integration</h5>
                    <p className="text-muted">
                      Seamlessly integrate with other smart city systems for comprehensive urban management.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>        
      </main>
    </div>
  );
};

export default Home;

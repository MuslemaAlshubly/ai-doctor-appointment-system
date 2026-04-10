import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaStethoscope, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { doctorAPI } from '../api';

function BrowseDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const patientName = localStorage.getItem('patientName');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand href="#home" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <FaStethoscope /> Patient Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
              <Nav.Link onClick={() => navigate('/doctors')}>Browse Doctors</Nav.Link>
              <Nav.Link onClick={() => navigate('/my-appointments')}>My Appointments</Nav.Link>
              <Nav.Link onClick={() => navigate('/profile')}>Profile</Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-danger">
                <FaSignOutAlt /> Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="main-content">
        <Container>
          <h2 style={{ marginBottom: '30px', color: '#333' }}>Available Doctors</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              {doctors && doctors.length > 0 ? (
                doctors.map(doctor => (
                  <Col md={6} lg={4} key={doctor._id} className="mb-4">
                    <Card className="card-custom h-100">
                      <Card.Body>
                        <Card.Title style={{ color: '#667eea', fontSize: '1.3rem' }}>
                          Dr. {doctor.name || 'Doctor'}
                        </Card.Title>
                        
                        <div className="mb-3">
                          <p style={{ color: '#764ba2', fontWeight: '500', marginBottom: '10px' }}>
                            <FaStethoscope /> {doctor.specialization || 'General Practice'}
                          </p>
                        </div>

                        {doctor.experience && (
                          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>
                            <strong>Experience:</strong> {doctor.experience} years
                          </p>
                        )}

                        {doctor.qualification && (
                          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>
                            <strong>Qualification:</strong> {doctor.qualification}
                          </p>
                        )}

                        {doctor.phone && (
                          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>
                            <FaPhone /> {doctor.phone}
                          </p>
                        )}

                        {doctor.schedule && (
                          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                            <FaCalendarAlt /> {doctor.schedule}
                          </p>
                        )}

                        <Button
                          className="btn-primary-custom w-100"
                          onClick={() => navigate(`/book/${doctor._id}`)}
                        >
                          <FaCalendarAlt /> Book Appointment
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <Alert variant="info">No doctors available at the moment.</Alert>
                </Col>
              )}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default BrowseDoctors;

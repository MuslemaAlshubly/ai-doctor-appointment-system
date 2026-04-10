import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaStethoscope, FaUser, FaSave, FaSignOutAlt } from 'react-icons/fa';
import { patientAPI } from '../api';

function PatientProfile() {
  const navigate = useNavigate();
  const patientId = localStorage.getItem('patientId');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  const fetchPatientInfo = async () => {
    try {
      const response = await patientAPI.getProfile();
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth || '',
        gender: response.data.gender || '',
        address: response.data.address || '',
        medicalHistory: response.data.medicalHistory || ''
      });
    } catch (err) {
      setError('Failed to load profile information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await patientAPI.updateProfile(patientId, formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
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
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">
                    <FaUser /> My Profile
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <>
                      {error && <Alert variant="danger">{error}</Alert>}
                      {success && <Alert variant="success">{success}</Alert>}

                      <Form onSubmit={handleSaveProfile}>
                        {/* Personal Information */}
                        <h5 style={{ marginTop: '20px', marginBottom: '15px', color: '#667eea' }}>
                          Personal Information
                        </h5>

                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control-custom"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="form-control-custom"
                          />
                          <small className="text-muted">Email cannot be changed</small>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control-custom"
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-control-custom"
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control-custom"
                          />
                        </Form.Group>

                        {/* Medical Information */}
                        <h5 style={{ marginTop: '30px', marginBottom: '15px', color: '#667eea' }}>
                          Medical Information
                        </h5>

                        <Form.Group className="mb-3">
                          <Form.Label>Medical History</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Please share any relevant medical history (e.g., allergies, chronic conditions, medications)"
                            className="form-control-custom"
                          />
                        </Form.Group>

                        {/* Buttons */}
                        <div style={{ marginTop: '30px' }}>
                          <Button
                            variant="primary"
                            type="submit"
                            className="btn-primary-custom"
                            disabled={saving}
                          >
                            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => navigate('/dashboard')}
                            style={{ marginLeft: '10px' }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default PatientProfile;

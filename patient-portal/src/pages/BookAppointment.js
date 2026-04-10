import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Alert, Spinner } from 'react-bootstrap';
import { FaStethoscope, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { doctorAPI, appointmentAPI, patientAPI } from '../api';

function BookAppointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const patientId = localStorage.getItem('patientId');
  const patientName = localStorage.getItem('patientName');

  const [doctor, setDoctor] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    appointmentDate: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const doctorResponse = await doctorAPI.getById(doctorId);
      setDoctor(doctorResponse.data);

      const patientResponse = await patientAPI.getProfile();
      setPatientInfo(patientResponse.data);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.appointmentDate || !formData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    setBooking(true);

    try {
      await appointmentAPI.bookAppointment(
        patientId,
        doctorId,
        patientInfo?.email,
        patientInfo?.phone,
        formData.appointmentDate,
        formData.reason,
        formData.notes
      );

      setSuccess('Appointment booked successfully!');
      setFormData({ appointmentDate: '', reason: '', notes: '' });

      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBooking(false);
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
          <Button 
            variant="link" 
            onClick={() => navigate('/doctors')}
            className="mb-4 p-0"
            style={{ color: '#667eea' }}
          >
            <FaArrowLeft /> Back to Doctors
          </Button>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              {/* Doctor Info */}
              <Col md={4} className="mb-4">
                <Card className="card-custom">
                  <Card.Body>
                    <Card.Title style={{ color: '#667eea' }}>
                      Dr. {doctor?.name || 'Doctor'}
                    </Card.Title>
                    <hr />
                    <p><strong>Specialization:</strong> {doctor?.specialization || 'N/A'}</p>
                    <p><strong>Experience:</strong> {doctor?.experience || 'N/A'} years</p>
                    <p><strong>Qualification:</strong> {doctor?.qualification || 'N/A'}</p>
                    <p><strong>Phone:</strong> {doctor?.phone || 'N/A'}</p>
                    <p><strong>Schedule:</strong> {doctor?.schedule || 'N/A'}</p>
                  </Card.Body>
                </Card>
              </Col>

              {/* Booking Form */}
              <Col md={8}>
                <Card className="card-custom">
                  <Card.Header className="bg-light">
                    <Card.Title className="mb-0">Book Appointment</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleBookAppointment}>
                      {/* Patient Info (Read-only) */}
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Patient Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={patientInfo?.name || ''}
                              disabled
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={patientInfo?.email || ''}
                              disabled
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="tel"
                              value={patientInfo?.phone || ''}
                              disabled
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <hr />

                      {/* Appointment Details */}
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Date & Time *</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          className="form-control-custom"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Reason for Appointment *</Form.Label>
                        <Form.Control
                          as="select"
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          className="form-control-custom"
                          required
                        >
                          <option value="">Select a reason</option>
                          <option value="General Checkup">General Checkup</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Treatment">Treatment</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Additional Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Add any additional information..."
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="btn-primary-custom"
                          disabled={booking}
                        >
                          {booking ? 'Booking...' : 'Confirm Booking'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => navigate('/doctors')}
                          disabled={booking}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default BookAppointment;

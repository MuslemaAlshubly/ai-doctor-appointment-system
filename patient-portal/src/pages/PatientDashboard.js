import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { FaCalendarAlt, FaStethoscope, FaUserCircle, FaSignOutAlt, FaBrain } from 'react-icons/fa';
import { appointmentAPI } from '../api';

function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientName = localStorage.getItem('patientName');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getPatientAppointments();
      // Filter appointments for current patient
      const filtered = response.data.filter(apt => apt.patientName);
      setAppointments(filtered.slice(0, 3)); // Show last 3
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
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
              <Nav.Link onClick={() => navigate('/ai-checker')}>AI Symptom Checker</Nav.Link>
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
          {/* Hero Section */}
          <div className="dashboard-hero">
            <h2>Welcome, {patientName}! 👋</h2>
            <p>Manage your appointments and find the best doctors for your health</p>
          </div>

          {/* Quick Actions */}
          <Row className="mb-5">
            <Col md={4} className="mb-3">
              <Card className="card-custom">
                <Card.Body className="text-center p-4">
                  <FaStethoscope style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                  <Card.Title>Browse Doctors</Card.Title>
                  <Card.Text>Find and book appointments with qualified doctors</Card.Text>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={() => navigate('/doctors')}
                  >
                    View Doctors
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="card-custom">
                <Card.Body className="text-center p-4">
                  <FaCalendarAlt style={{ fontSize: '3rem', color: '#764ba2', marginBottom: '15px' }} />
                  <Card.Title>My Appointments</Card.Title>
                  <Card.Text>View and manage your scheduled appointments</Card.Text>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={() => navigate('/my-appointments')}
                  >
                    View Appointments
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="card-custom">
                <Card.Body className="text-center p-4">
                  <FaUserCircle style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                  <Card.Title>My Profile</Card.Title>
                  <Card.Text>Update your personal and medical information</Card.Text>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={() => navigate('/profile')}
                  >
                    Edit Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* AI Symptom Checker */}
          <Row className="mb-5">
            <Col md={6} className="mb-3">
              <Card className="card-custom" style={{ borderTop: '3px solid #667eea' }}>
                <Card.Body className="text-center p-4">
                  <FaBrain style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                  <Card.Title>AI Symptom Checker</Card.Title>
                  <Card.Text>Describe your symptoms and get AI-powered doctor recommendations</Card.Text>
                  <Button 
                    className="btn-primary-custom" 
                    onClick={() => navigate('/ai-checker')}
                  >
                    Check Symptoms
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Appointments */}
          <Row>
            <Col md={12}>
              <Card className="card-custom">
                <Card.Header className="bg-light" style={{ borderRadius: '10px 10px 0 0' }}>
                  <Card.Title className="mb-0">Recent Appointments</Card.Title>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <p>Loading appointments...</p>
                  ) : appointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Doctor</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(apt => (
                            <tr key={apt._id}>
                              <td>{apt.doctorName || 'N/A'}</td>
                              <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
                              <td>
                                <span className={`badge badge-${apt.status || 'pending'}`}>
                                  {apt.status || 'Pending'}
                                </span>
                              </td>
                              <td>{apt.reason || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No appointments scheduled yet.</p>
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

export default PatientDashboard;

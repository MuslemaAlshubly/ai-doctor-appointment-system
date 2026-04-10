import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav, Alert, Spinner, Table } from 'react-bootstrap';
import { FaStethoscope, FaTrash, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { appointmentAPI } from '../api';

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const patientName = localStorage.getItem('patientName');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getPatientAppointments();
      // Filter to show all appointments
      setAppointments(response.data || []);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancelAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
      alert('Appointment cancelled successfully');
    } catch (err) {
      alert('Failed to cancel appointment');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    navigate('/login');
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed':
        return 'badge-completed';
      case 'confirmed':
        return 'badge-confirmed';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-pending';
    }
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
          <h2 style={{ marginBottom: '30px', color: '#333' }}>
            <FaCalendarAlt /> My Appointments
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Card className="card-custom">
              <Card.Body>
                {appointments && appointments.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th>Doctor</th>
                          <th>Specialization</th>
                          <th>Date & Time</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map(apt => (
                          <tr key={apt._id}>
                            <td style={{ fontWeight: '500' }}>
                              Dr. {apt.doctorName || 'N/A'}
                            </td>
                            <td>{apt.specialization || 'N/A'}</td>
                            <td>
                              {new Date(apt.appointmentDate).toLocaleString()}
                            </td>
                            <td>{apt.reason || 'N/A'}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(apt.status)}`}>
                                {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Pending'}
                              </span>
                            </td>
                            <td>
                              {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(apt._id)}
                                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                >
                                  <FaTrash /> Cancel
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <FaCalendarAlt style={{ fontSize: '3rem', color: '#ddd', marginBottom: '15px' }} />
                    <p style={{ color: '#999', fontSize: '1.1rem' }}>No appointments scheduled yet.</p>
                    <Button
                      className="btn-primary-custom mt-3"
                      onClick={() => navigate('/doctors')}
                    >
                      Book Your First Appointment
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </div>
  );
}

export default MyAppointments;

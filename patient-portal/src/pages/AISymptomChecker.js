import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav, Form, Alert, Spinner } from 'react-bootstrap';
import { FaStethoscope, FaRobot, FaBrain, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';
import { doctorAPI } from '../api';

function AISymptomChecker() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem('patientName');
  const patientId = localStorage.getItem('patientId');

  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [aiResponse, setAiResponse] = useState('');
  const [recommendedSpecialization, setRecommendedSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const analyzeSymptoms = async (e) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setAiResponse('');
    setRecommendedSpecialization('');
    setShowResults(false);

    try {
      // Call backend AI endpoint
      const response = await fetch('http://localhost:5000/api/ai/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
        },
        body: JSON.stringify({
          symptoms,
          duration,
          severity,
          patientId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAiResponse(data.analysis);
      setRecommendedSpecialization(data.recommendedSpecialization);
      setShowResults(true);
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms. Please try again.');
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

  const getRecommendedDoctors = () => {
    if (!recommendedSpecialization) return [];
    return doctors.filter(doc => 
      doc.specialization && 
      doc.specialization.toLowerCase().includes(recommendedSpecialization.toLowerCase())
    );
  };

  const recommendedDoctors = getRecommendedDoctors();

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
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }}>
              <FaRobot style={{ marginRight: '15px' }} />
              <FaBrain />
            </div>
            <h2 style={{ marginBottom: '10px' }}>AI Symptom Checker</h2>
            <p style={{ color: '#666', fontSize: '1.05rem' }}>
              Describe your symptoms and let our AI help recommend the right doctor for you
            </p>
          </div>

          <Row>
            {/* Input Form */}
            <Col lg={6} className="mb-4">
              <Card className="card-custom">
                <Card.Header className="bg-light">
                  <Card.Title className="mb-0">Describe Your Symptoms</Card.Title>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={analyzeSymptoms}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '500' }}>Your Symptoms *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Describe your symptoms in detail. For example: 'I have a persistent cough, sore throat, and mild fever for the past 3 days...'"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="form-control-custom"
                        disabled={loading}
                      />
                      <small className="text-muted">Be as detailed as possible for better recommendations</small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '500' }}>Duration</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 3 days, 2 weeks, 1 month"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="form-control-custom"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: '500' }}>Severity</Form.Label>
                      <Form.Select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="form-control-custom"
                        disabled={loading}
                      >
                        <option value="mild">Mild (Uncomfortable but manageable)</option>
                        <option value="moderate">Moderate (Affecting daily activities)</option>
                        <option value="severe">Severe (Significantly limiting activities)</option>
                      </Form.Select>
                    </Form.Group>

                    <Button
                      className="btn-primary-custom w-100"
                      type="submit"
                      disabled={loading}
                      style={{ padding: '12px' }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" style={{ marginRight: '8px' }} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FaBrain style={{ marginRight: '8px' }} />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Results */}
            <Col lg={6} className="mb-4">
              {showResults ? (
                <>
                  {/* AI Analysis */}
                  <Card className="card-custom mb-4" style={{ borderLeft: '4px solid #667eea' }}>
                    <Card.Header className="bg-light">
                      <Card.Title className="mb-0">
                        <FaRobot style={{ marginRight: '8px', color: '#667eea' }} />
                        AI Analysis
                      </Card.Title>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <p style={{ lineHeight: '1.6', color: '#333' }}>
                        {aiResponse}
                      </p>
                    </Card.Body>
                  </Card>

                  {/* Recommended Specialization */}
                  {recommendedSpecialization && (
                    <Alert variant="info" className="alert-custom" style={{ marginBottom: '20px' }}>
                      <strong>Recommended Specialization:</strong> {recommendedSpecialization}
                    </Alert>
                  )}

                  {/* Recommended Doctors */}
                  {recommendedDoctors.length > 0 ? (
                    <Card className="card-custom" style={{ borderLeft: '4px solid #28a745' }}>
                      <Card.Header className="bg-light">
                        <Card.Title className="mb-0">
                          🩺 Recommended Doctors
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        {recommendedDoctors.map(doc => (
                          <div 
                            key={doc._id}
                            style={{
                              padding: '12px',
                              marginBottom: '10px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              borderLeft: '3px solid #28a745'
                            }}
                          >
                            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                              Dr. {doc.name}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#667eea', marginBottom: '8px' }}>
                              {doc.specialization}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                              {doc.experience && `${doc.experience} years experience`}
                            </div>
                            <Button
                              size="sm"
                              className="btn-primary-custom"
                              onClick={() => navigate(`/book/${doc._id}`)}
                              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            >
                              Book Appointment <FaArrowRight style={{ marginLeft: '5px' }} />
                            </Button>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  ) : recommendedSpecialization ? (
                    <Alert variant="warning" className="alert-custom">
                      No doctors found with {recommendedSpecialization} specialization. 
                      <br />
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/doctors')}
                        style={{ padding: 0, marginTop: '10px' }}
                      >
                        Browse all doctors
                      </Button>
                    </Alert>
                  ) : null}
                </>
              ) : (
                <Card className="card-custom">
                  <Card.Body style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <FaBrain style={{ fontSize: '3rem', color: '#ddd', marginBottom: '15px' }} />
                    <p style={{ color: '#999' }}>
                      Describe your symptoms on the left and click "Analyze with AI" to get recommendations
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          {/* Info Section */}
          <Row className="mt-5">
            <Col md={4} className="mb-3">
              <Card className="card-custom text-center">
                <Card.Body>
                  <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>
                    🔍
                  </div>
                  <Card.Title>Accurate Analysis</Card.Title>
                  <Card.Text>
                    Our AI uses advanced medical knowledge to analyze your symptoms
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="card-custom text-center">
                <Card.Body>
                  <div style={{ fontSize: '2rem', color: '#764ba2', marginBottom: '10px' }}>
                    ⚡
                  </div>
                  <Card.Title>Quick Recommendations</Card.Title>
                  <Card.Text>
                    Get instant doctor recommendations based on your symptoms
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="card-custom text-center">
                <Card.Body>
                  <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '10px' }}>
                    📅
                  </div>
                  <Card.Title>Easy Booking</Card.Title>
                  <Card.Text>
                    Book appointments immediately with recommended specialists
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Disclaimer */}
          <Alert variant="light" style={{ marginTop: '40px', border: '1px solid #ddd' }}>
            <strong>⚠️ Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </Alert>
        </Container>
      </div>
    </div>
  );
}

export default AISymptomChecker;

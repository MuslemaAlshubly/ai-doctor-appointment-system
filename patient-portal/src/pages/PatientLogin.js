import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { patientAPI } from '../api';

function PatientLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await patientAPI.login(email, password);
      
      // Store token and patient info
      localStorage.setItem('patientToken', response.data.token);
      localStorage.setItem('patientId', response.data.patientId);
      localStorage.setItem('patientName', response.data.patientName);
      
      onLoginSuccess();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaUser style={{ fontSize: '3rem', color: '#667eea' }} />
        </div>
        <h2 className="auth-title">Patient Login</h2>
        
        {error && <Alert variant="danger" className="alert-custom">{error}</Alert>}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 btn-primary-custom"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#667eea', fontWeight: 'bold' }}>Register here</Link>
        </p>

        <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '10px' }}>Demo Credentials:</p>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            <strong>Email:</strong> patient@example.com<br />
            <strong>Password:</strong> patient123
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;

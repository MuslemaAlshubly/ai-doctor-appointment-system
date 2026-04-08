import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { FaHospital } from 'react-icons/fa';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, adminName } = response.data;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', adminName);

      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 40,
          background: 'white',
          borderRadius: 10,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 50, marginBottom: 15, color: '#2563eb' }}>
            <FaHospital />
          </div>
          <h1 style={{ fontSize: 28, color: '#1f2937', marginBottom: 10 }}>Admin Portal</h1>
          <p style={{ color: '#6b7280' }}>AI Doctor Appointment System</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div
              style={{
                padding: 12,
                marginBottom: 20,
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#1f2937' }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#1f2937' }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{
              padding: '12px',
              fontSize: 16,
              fontWeight: 'bold',
              background: loading ? '#ccc' : '#2563eb',
              border: 'none',
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ marginRight: 8 }}
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: '#f0f9ff',
            borderRadius: 6,
            fontSize: 12,
            color: '#0c4a6e',
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Email: admin@example.com
          <br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}

export default Login;

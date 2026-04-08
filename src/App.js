import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DoctorManagement from './pages/DoctorManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import PatientManagement from './pages/PatientManagement';
import SystemSettings from './pages/SystemSettings';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorManagement />} />
          <Route path="/appointments" element={<AppointmentManagement />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

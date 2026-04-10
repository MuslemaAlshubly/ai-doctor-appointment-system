import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import PatientLogin from './pages/PatientLogin';
import PatientRegister from './pages/PatientRegister';
import PatientDashboard from './pages/PatientDashboard';
import BrowseDoctors from './pages/BrowseDoctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import PatientProfile from './pages/PatientProfile';
import AISymptomChecker from './pages/AISymptomChecker';

function App() {
  const [token, setToken] = useState(localStorage.getItem('patientToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('patientToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<PatientLogin onLoginSuccess={() => setToken(localStorage.getItem('patientToken'))} />} />
            <Route path="/register" element={<PatientRegister />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/ai-checker" element={<AISymptomChecker />} />
            <Route path="/doctors" element={<BrowseDoctors />} />
            <Route path="/book/:doctorId" element={<BookAppointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/profile" element={<PatientProfile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

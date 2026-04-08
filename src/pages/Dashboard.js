import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { dashboardAPI } from '../services/api';
import { FaUserMd, FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

function Dashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await dashboardAPI.getStats();
      setStats(statsResponse.data);

      const appointmentsResponse = await dashboardAPI.getRecentAppointments();
      setRecentAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
      <Navbar title="Dashboard" />

      <div className="stats-grid">
        <StatsCard
          icon={FaUserMd}
          label="Total Doctors"
          value={stats.totalDoctors}
          color="#2563eb"
        />
        <StatsCard
          icon={FaCalendarAlt}
          label="Total Appointments"
          value={stats.totalAppointments}
          color="#16a34a"
        />
        <StatsCard
          icon={FaUsers}
          label="Total Patients"
          value={stats.totalPatients}
          color="#ea580c"
        />
        <StatsCard
          icon={FaCheckCircle}
          label="Completed"
          value={stats.completedAppointments}
          color="#6366f1"
        />
      </div>

      <div className="content-card">
        <h2 style={{ marginBottom: 25, color: '#1f2937' }}>
          <i className="fas fa-clock" style={{ marginRight: 10 }}></i>
          Recent Appointments
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No appointments yet</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table-hover">
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <strong>{appointment.patientName}</strong>
                    </td>
                    <td>{appointment.doctorName}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          appointment.status === 'completed'
                            ? 'status-active'
                            : appointment.status === 'pending'
                            ? 'status-pending'
                            : 'status-inactive'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

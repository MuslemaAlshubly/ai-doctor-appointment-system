import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { appointmentsAPI } from '../services/api';

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentsAPI.changeStatus(id, newStatus);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const filteredAppointments =
    filterStatus === 'all'
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  return (
    <div className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
      <Navbar title="Appointment Management" />

      <div className="content-card">
        <div style={{ marginBottom: 25 }}>
          <h2 style={{ marginBottom: 15, color: '#1f2937' }}>All Appointments</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                className={`btn ${
                  filterStatus === status ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setFilterStatus(status)}
                style={{ textTransform: 'capitalize' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar"></i>
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table-hover">
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
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
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                      >
                        Complete
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(appointment._id)}
                      >
                        Delete
                      </button>
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

export default AppointmentManagement;

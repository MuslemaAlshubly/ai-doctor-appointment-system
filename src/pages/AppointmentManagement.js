import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { appointmentsAPI, doctorsAPI, patientsAPI } from '../services/api';

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorName: '',
    doctorId: '',
    appointmentDate: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        doctorsAPI.getAll(),
        patientsAPI.getAll(),
      ]);
      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorName: '',
      doctorId: '',
      appointmentDate: '',
      reason: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (appointment) => {
    setEditingId(appointment._id);
    setFormData(appointment);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await appointmentsAPI.update(editingId, formData);
      } else {
        await appointmentsAPI.create(formData);
      }
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Error saving appointment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentsAPI.changeStatus(id, newStatus);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment status');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>All Appointments</h2>
          <button
            className="btn btn-primary"
            onClick={handleAddClick}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <i className="fas fa-plus"></i> Add Appointment
          </button>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
                  <th>Patient Name</th>
                  <th>Patient Email</th>
                  <th>Doctor Name</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <strong>{appointment.patientName || 'N/A'}</strong>
                    </td>
                    <td>{appointment.patientEmail || 'N/A'}</td>
                    <td>{appointment.doctorName || 'N/A'}</td>
                    <td>
                      {appointment.appointmentDate
                        ? new Date(appointment.appointmentDate).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td>{appointment.reason || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge ${
                          appointment.status === 'completed'
                            ? 'status-active'
                            : appointment.status === 'pending'
                            ? 'status-pending'
                            : appointment.status === 'confirmed'
                            ? 'bg-info'
                            : 'status-inactive'
                        }`}
                      >
                        {appointment.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEditClick(appointment)}
                      >
                        Edit
                      </button>
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

      {/* Add/Edit Modal */}
      <div
        style={{
          display: showModal ? 'block' : 'none',
          position: 'fixed',
          zIndex: 1050,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'white',
            margin: '3% auto',
            padding: 0,
            border: '1px solid #ccc',
            borderRadius: 8,
            width: '90%',
            maxWidth: 600,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: 20,
              background: '#2563eb',
              color: 'white',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
            }}
          >
            <h5 style={{ margin: 0 }}>
              {editingId ? 'Edit Appointment' : 'Add New Appointment'}
            </h5>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20 }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Patient Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Patient Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Patient Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Doctor Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Appointment Date & Time *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Reason for Visit *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Appointment' : 'Add Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppointmentManagement;

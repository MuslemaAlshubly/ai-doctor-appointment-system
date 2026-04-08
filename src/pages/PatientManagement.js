import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { patientsAPI } from '../services/api';

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      medicalHistory: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (patient) => {
    setEditingId(patient._id);
    setFormData(patient);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await patientsAPI.update(editingId, formData);
      } else {
        await patientsAPI.create(formData);
      }
      setShowModal(false);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientsAPI.delete(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  return (
    <div className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
      <Navbar title="Patient Management" />

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Patients Database</h2>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add Patient
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users"></i>
            <p>No patients found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table-hover">
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <strong>{patient.name}</strong>
                    </td>
                    <td>{patient.email}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.gender}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(patient)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(patient._id)}
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
            margin: '5% auto',
            padding: 0,
            border: '1px solid #ccc',
            borderRadius: 8,
            width: '90%',
            maxWidth: 500,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
            }}
          >
            <h5 style={{ margin: 0 }}>
              {editingId ? 'Edit Patient' : 'Add New Patient'}
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
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
                {editingId ? 'Update Patient' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientManagement;

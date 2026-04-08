import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { doctorsAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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
      specialization: '',
      licenseNumber: '',
      yearsOfExperience: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (doctor) => {
    setEditingId(doctor._id);
    setFormData(doctor);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await doctorsAPI.update(editingId, formData);
      } else {
        await doctorsAPI.create(formData);
      }
      setShowModal(false);
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorsAPI.delete(id);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
      <Navbar title="Doctor Management" />

      <div className="content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Doctors Database</h2>
          <button
            className="btn btn-primary"
            onClick={handleAddClick}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FaPlus /> Add Doctor
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-user-md"></i>
            <p>No doctors found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table-hover">
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      <strong>{doctor.name}</strong>
                    </td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.yearsOfExperience} years</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(doctor)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doctor._id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      >
                        <FaTrash /> Delete
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
              {editingId ? 'Edit Doctor' : 'Add New Doctor'}
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
              <label className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">License Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                className="form-control"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                required
              />
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
                {editingId ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorManagement;

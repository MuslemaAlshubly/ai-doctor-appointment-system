import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (doctor) => api.post('/doctors', doctor),
  update: (id, doctor) => api.put(`/doctors/${id}`, doctor),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (appointment) => api.post('/appointments', appointment),
  update: (id, appointment) => api.put(`/appointments/${id}`, appointment),
  delete: (id) => api.delete(`/appointments/${id}`),
  changeStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

// Patients API
export const patientsAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (patient) => api.post('/patients', patient),
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentAppointments: () => api.get('/dashboard/recent-appointments'),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
};

export default api;

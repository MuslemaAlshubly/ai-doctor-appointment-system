import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('patientToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const patientAPI = {
  register: (email, password, name, phone, dateOfBirth = '', gender = '', address = '') => 
    api.post('/patient/register', { email, password, name, phone, dateOfBirth, gender, address }),
  
  login: (email, password) => 
    api.post('/patient/login', { email, password }),
  
  getProfile: () => 
    api.get('/patient/me'),
  
  updateProfile: (patientId, data) => 
    api.put(`/patients/${patientId}`, data),
};

export const doctorAPI = {
  getAll: () => 
    api.get('/doctors'),
  
  getById: (doctorId) => 
    api.get(`/doctors/${doctorId}`),
};

export const appointmentAPI = {
  getPatientAppointments: () => 
    api.get('/appointments'),
  
  bookAppointment: (patientId, doctorId, patientEmail, patientPhone, appointmentDate, reason, notes = '') => 
    api.post('/appointments', {
      patientId,
      doctorId,
      patientEmail,
      patientPhone,
      appointmentDate,
      reason,
      notes,
      status: 'pending'
    }),
  
  updateAppointment: (appointmentId, data) => 
    api.put(`/appointments/${appointmentId}`, data),
  
  cancelAppointment: (appointmentId) => 
    api.delete(`/appointments/${appointmentId}`),
};

export default api;

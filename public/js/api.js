// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Mock mode - set to true to test without backend
// When MOCK_MODE is true: Frontend works with simulated data
// When MOCK_MODE is false: Frontend connects to real backend API
// IMPORTANT: Change this to false once your backend is ready!
const MOCK_MODE = true;

// Mock data for testing
const MOCK_DATA = {
    users: {
        'test@example.com': {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '+1 (555) 000-0000',
            age: 30,
            bloodType: 'O+',
            allergies: '',
            medicalHistory: '',
            appointments: [
                {
                    _id: 'apt-001',
                    doctor: 'Dr. Ahmed Hassan',
                    date: '2026-04-20',
                    time: '14:00',
                    reason: 'Regular checkup',
                    notes: '',
                    status: 'upcoming'
                }
            ]
        }
    }
};

const API = {
    // Authentication
    login: async (email, password) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = MOCK_DATA.users[email];
                    if (user && user.password === password) {
                        resolve({
                            token: 'mock-token-' + Date.now(),
                            user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
                            error: false
                        });
                    } else {
                        resolve({ error: true, message: 'Invalid email or password' });
                    }
                }, 800);
            });
        }
        return fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
    },

    register: async (userData) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (MOCK_DATA.users[userData.email]) {
                        resolve({ error: true, message: 'Email already exists' });
                    } else {
                        const newUser = {
                            id: 'user-' + Date.now(),
                            ...userData,
                            age: null,
                            bloodType: '',
                            allergies: '',
                            medicalHistory: '',
                            appointments: []
                        };
                        MOCK_DATA.users[userData.email] = newUser;
                        resolve({
                            token: 'mock-token-' + Date.now(),
                            user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone },
                            error: false
                        });
                    }
                }, 800);
            });
        }
        return fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }).then(res => res.json());
    },

    // User Profile
    getProfile: async () => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const fullUser = MOCK_DATA.users[user.email] || user;
                    resolve({ user: fullUser, error: false });
                }, 500);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    updateProfile: async (userData) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const updatedUser = { ...MOCK_DATA.users[user.email], ...userData };
                    MOCK_DATA.users[user.email] = updatedUser;
                    resolve({ user: updatedUser, error: false });
                }, 500);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        }).then(res => res.json());
    },

    // Appointments
    bookAppointment: async (appointmentData) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const userEmail = user?.email;
                    console.log('=== BOOKING APPOINTMENT ===');
                    console.log('User email:', userEmail);
                    console.log('MOCK_DATA users:', Object.keys(MOCK_DATA.users));
                    
                    if (!user || !userEmail) {
                        console.error('No user logged in!');
                        resolve({ error: true, message: 'Not logged in' });
                        return;
                    }
                    
                    const newApt = {
                        _id: 'apt-' + Date.now(),
                        ...appointmentData,
                        status: 'upcoming'
                    };
                    
                    if (!MOCK_DATA.users[userEmail]) {
                        console.error('User not found in MOCK_DATA. Creating entry...');
                        MOCK_DATA.users[userEmail] = {
                            ...user,
                            appointments: []
                        };
                    }
                    
                    if (!MOCK_DATA.users[userEmail].appointments) {
                        MOCK_DATA.users[userEmail].appointments = [];
                    }
                    
                    MOCK_DATA.users[userEmail].appointments.push(newApt);
                    console.log('✓ Appointment saved!');
                    console.log('Total appointments for user:', MOCK_DATA.users[userEmail].appointments.length);
                    console.log('Appointments:', MOCK_DATA.users[userEmail].appointments);
                    
                    resolve({ appointment: newApt, error: false });
                }, 800);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(appointmentData)
        }).then(res => res.json());
    },

    getAppointments: async (status = null) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const userEmail = user?.email;
                    
                    console.log('=== GETTING APPOINTMENTS ===');
                    console.log('User email:', userEmail);
                    console.log('MOCK_DATA users:', Object.keys(MOCK_DATA.users));
                    
                    let apts = [];
                    if (!user || !userEmail) {
                        console.error('No user logged in!');
                        resolve({ appointments: apts, error: false });
                        return;
                    }
                    
                    if (MOCK_DATA.users[userEmail]) {
                        if (MOCK_DATA.users[userEmail].appointments) {
                            apts = [...MOCK_DATA.users[userEmail].appointments];
                            console.log('✓ Found ' + apts.length + ' appointments');
                            console.log('Appointments:', apts);
                        } else {
                            console.log('User has no appointments array');
                        }
                    } else {
                        console.log('User not in MOCK_DATA');
                    }
                    
                    if (status) {
                        apts = apts.filter(a => a.status === status);
                        console.log('Filtered by status "' + status + '":', apts.length);
                    }
                    
                    resolve({ appointments: apts, error: false });
                }, 500);
            });
        }
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/appointments`;
        if (status) {
            url += `?status=${status}`;
        }
        return fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    cancelAppointment: async (appointmentId) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const userEmail = user.email;
                    if (MOCK_DATA.users[userEmail] && MOCK_DATA.users[userEmail].appointments) {
                        const apt = MOCK_DATA.users[userEmail].appointments.find(a => a._id === appointmentId);
                        if (apt) {
                            apt.status = 'cancelled';
                            resolve({ success: true, error: false });
                        } else {
                            resolve({ error: true, message: 'Appointment not found' });
                        }
                    } else {
                        resolve({ error: true, message: 'Appointment not found' });
                    }
                }, 500);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    // AI Consultation
    askAI: async (question) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = [
                    'Based on your symptoms, this could be a common cold. Rest, stay hydrated, and monitor your temperature.',
                    'For headaches, try resting in a quiet room and staying hydrated. If it persists, consult a doctor.',
                    'Regular exercise and a balanced diet can help improve your health. Aim for 30 minutes of activity daily.',
                    'If you have a persistent cough, it may be worth seeing a doctor to rule out infections.',
                    'Getting 7-9 hours of sleep is important for your health. Try maintaining a consistent sleep schedule.'
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                resolve({ response: response, error: false });
            }, 1000);
        });
    },

    getConsultationHistory: async () => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ history: [], error: false });
                }, 300);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/ai/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const user = Auth.getUser();
                    const userEmail = user.email;
                    let upcoming = 0;
                    let completed = 0;
                    if (MOCK_DATA.users[userEmail] && MOCK_DATA.users[userEmail].appointments) {
                        upcoming = MOCK_DATA.users[userEmail].appointments.filter(a => a.status === 'upcoming').length;
                        completed = MOCK_DATA.users[userEmail].appointments.filter(a => a.status === 'completed').length;
                    }
                    resolve({
                        upcomingCount: upcoming,
                        completedCount: completed,
                        aiQueriesCount: 0,
                        error: false
                    });
                }, 500);
            });
        }
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    }
};

// Error handling wrapper
const apiCall = async (fn, errorMessage = 'An error occurred') => {
    try {
        const result = await fn();
        if (result.error) {
            throw new Error(result.message || errorMessage);
        }
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

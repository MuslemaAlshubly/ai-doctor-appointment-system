// Main Application Logic
const app = {
    currentPage: 'dashboard',
    currentUser: null,
    appointments: [],
    filteredAppointments: [],

    // Initialize the application
    init: () => {
        if (Auth.isAuthenticated()) {
            app.currentUser = Auth.getUser();
            app.showMain();
            app.loadDashboard();
        } else {
            app.showPage('login');
        }

        app.attachEventListeners();
    },

    // Attach event listeners
    attachEventListeners: () => {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', app.handleLogin);
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', app.handleRegister);
        }

        // Appointment form
        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', app.handleBookAppointment);
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', app.handleProfileUpdate);
        }

        // Chat form
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', app.sendChatMessage);
        }

        // Set minimum date to today
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    },

    // Show/hide pages
    showPage: (pageName) => {
        console.log('Showing page:', pageName);
        
        // Hide all pages properly
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('active');
        });
        document.querySelectorAll('.content-page').forEach(page => {
            page.classList.remove('active');
        });

        // Hide main app if showing auth pages
        if (pageName === 'login' || pageName === 'register') {
            document.getElementById('main-app').classList.add('hidden');
            document.getElementById(pageName + '-page').classList.remove('hidden');
        } else {
            // Show main app and content page
            document.getElementById('main-app').classList.remove('hidden');
            const contentPage = document.getElementById(pageName);
            console.log('Content page element:', contentPage);
            if (contentPage) {
                contentPage.classList.add('active');
                app.currentPage = pageName;
                
                // Update sidebar active state - map page names to nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Find and highlight the correct nav item
                const navMap = {
                    'dashboard': 0,
                    'book-appointment': 1,
                    'my-appointments': 2,
                    'ai-consultation': 3,
                    'profile': 4
                };
                const navIndex = navMap[pageName];
                if (navIndex !== undefined) {
                    const navItems = document.querySelectorAll('.nav-item');
                    if (navItems[navIndex]) {
                        navItems[navIndex].classList.add('active');
                    }
                }

                // Update page title
                const titles = {
                    'dashboard': 'Dashboard',
                    'book-appointment': 'Book Appointment',
                    'my-appointments': 'My Appointments',
                    'ai-consultation': 'AI Consultation',
                    'profile': 'My Profile'
                };
                document.getElementById('page-title').textContent = titles[pageName] || pageName;

                // Load page-specific data
                if (pageName === 'my-appointments') {
                    app.loadAppointments();
                } else if (pageName === 'profile') {
                    app.loadProfile();
                }
            }
        }
    },

    // Show main app
    showMain: () => {
        document.getElementById('main-app').classList.remove('hidden');
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
    },

    // Handle login
    handleLogin: async (e) => {
        e.preventDefault();
        app.showLoading(true);

        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const response = await Auth.login(email, password);
            app.currentUser = response.user;

            app.showNotification('Login successful!', 'success');
            app.showMain();
            app.showPage('dashboard');
            app.loadDashboard();
        } catch (error) {
            app.showNotification(error.message || 'Login failed', 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Handle registration
    handleRegister: async (e) => {
        e.preventDefault();
        app.showLoading(true);

        try {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const phone = document.getElementById('register-phone').value;

            const response = await Auth.register(name, email, password, phone);
            app.currentUser = response.user;

            app.showNotification('Account created successfully!', 'success');
            document.getElementById('register-form').reset();
            app.showMain();
            app.showPage('dashboard');
            app.loadDashboard();
        } catch (error) {
            app.showNotification(error.message || 'Registration failed', 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Handle book appointment
    handleBookAppointment: async (e) => {
        e.preventDefault();
        app.showLoading(true);

        try {
            const appointmentData = {
                doctor: document.getElementById('doctor-select').value,
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                reason: document.getElementById('appointment-reason').value,
                notes: document.getElementById('appointment-notes').value
            };

            console.log('Booking appointment:', appointmentData);
            console.log('Current user:', Auth.getUser());
            
            const response = await API.bookAppointment(appointmentData);
            
            console.log('Book response:', response);

            if (response.error) {
                throw new Error(response.message || 'Failed to book appointment');
            }

            app.showNotification('Appointment booked successfully!', 'success');
            e.target.reset();
            setTimeout(() => app.showPage('my-appointments'), 1000);
        } catch (error) {
            app.showNotification(error.message || 'Failed to book appointment', 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Handle profile update
    handleProfileUpdate: async (e) => {
        e.preventDefault();
        app.showLoading(true);

        try {
            const userData = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                phone: document.getElementById('profile-phone').value,
                age: parseInt(document.getElementById('profile-age').value) || null,
                bloodType: document.getElementById('profile-blood-type').value,
                allergies: document.getElementById('profile-allergies').value,
                medicalHistory: document.getElementById('profile-medical-history').value
            };

            const response = await API.updateProfile(userData);

            if (response.error) {
                throw new Error(response.message || 'Failed to update profile');
            }

            app.currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            app.showNotification('Profile updated successfully!', 'success');
        } catch (error) {
            app.showNotification(error.message || 'Failed to update profile', 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Load dashboard
    loadDashboard: async () => {
        try {
            app.showLoading(true);

            // Update welcome message
            document.getElementById('welcome-name').textContent = app.currentUser?.name || 'User';
            document.getElementById('user-name').textContent = app.currentUser?.name || 'User';

            // Try to load stats from API
            try {
                const stats = await API.getDashboardStats();
                if (!stats.error) {
                    document.getElementById('upcoming-count').textContent = stats.upcomingCount || 0;
                    document.getElementById('completed-count').textContent = stats.completedCount || 0;
                    document.getElementById('ai-queries-count').textContent = stats.aiQueriesCount || 0;
                }
            } catch (error) {
                // Use default values if API fails
                console.warn('Could not load dashboard stats:', error);
            }

            // Load upcoming appointments
            app.loadUpcomingAppointments();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            app.showLoading(false);
        }
    },

    // Load upcoming appointments
    loadUpcomingAppointments: async () => {
        try {
            const response = await API.getAppointments('upcoming');
            if (!response.error && response.appointments) {
                const list = document.getElementById('upcoming-appointments-list');
                const appointments = response.appointments.slice(0, 3);

                if (appointments.length === 0) {
                    list.innerHTML = '<p class="empty-state">No upcoming appointments</p>';
                } else {
                    list.innerHTML = appointments.map(apt => `
                        <div class="appointment-card">
                            <div class="appointment-header">
                                <div class="appointment-doctor">${apt.doctor}</div>
                                <span class="appointment-status status-upcoming">Upcoming</span>
                            </div>
                            <div class="appointment-details">
                                <div class="appointment-detail">📅 ${new Date(apt.date).toLocaleDateString()}</div>
                                <div class="appointment-detail">⏰ ${apt.time}</div>
                            </div>
                            <div class="appointment-reason">${apt.reason}</div>
                        </div>
                    `).join('');
                }
            }
        } catch (error) {
            console.warn('Could not load upcoming appointments:', error);
        }
    },

    // Load appointments
    loadAppointments: async () => {
        try {
            app.showLoading(true);
            const response = await API.getAppointments();
            
            console.log('Appointments response:', response);
            console.log('Current user:', Auth.getUser());

            if (response.error) {
                throw new Error(response.message || 'Failed to load appointments');
            }

            app.appointments = response.appointments || [];
            console.log('App appointments set to:', app.appointments);
            app.filterAppointments('upcoming');
        } catch (error) {
            console.error('Error loading appointments:', error);
            app.appointments = [];
            app.filteredAppointments = [];
            app.renderAppointments();
            app.showNotification('Could not load appointments: ' + error.message, 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Filter appointments
    filterAppointments: (status) => {
        console.log('Filtering appointments by status:', status);
        console.log('All appointments:', app.appointments);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Find and highlight the correct tab button
        const tabMap = { 'upcoming': 0, 'completed': 1, 'all': 2 };
        const tabIndex = tabMap[status];
        if (tabIndex !== undefined) {
            const tabs = document.querySelectorAll('.tab-btn');
            if (tabs[tabIndex]) {
                tabs[tabIndex].classList.add('active');
            }
        }

        // Filter appointments
        if (status === 'all') {
            app.filteredAppointments = app.appointments;
        } else {
            app.filteredAppointments = app.appointments.filter(apt => apt.status === status);
        }

        console.log('Filtered appointments:', app.filteredAppointments);
        
        // Render appointments
        app.renderAppointments();
    },

    // Render appointments
    renderAppointments: () => {
        const container = document.getElementById('appointments-container');
        console.log('Rendering appointments. Container:', container);
        console.log('Filtered appointments:', app.filteredAppointments);

        if (app.filteredAppointments.length === 0) {
            container.innerHTML = '<p class="empty-state">No appointments found</p>';
            console.log('No appointments to display');
            return;
        }

        container.innerHTML = app.filteredAppointments.map(apt => `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-doctor">${apt.doctor}</div>
                    <span class="appointment-status status-${apt.status}">${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
                </div>
                <div class="appointment-details">
                    <div class="appointment-detail">📅 ${new Date(apt.date).toLocaleDateString()}</div>
                    <div class="appointment-detail">⏰ ${apt.time}</div>
                    <div class="appointment-detail">👨‍⚕️ ${apt.doctor}</div>
                </div>
                <div class="appointment-reason"><strong>Reason:</strong> ${apt.reason}</div>
                ${apt.notes ? `<div class="appointment-reason"><strong>Notes:</strong> ${apt.notes}</div>` : ''}
                <div class="appointment-actions">
                    ${apt.status === 'upcoming' ? `
                        <button class="btn btn-secondary" onclick="app.cancelAppointmentAction('${apt._id}')">Cancel</button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="alert('Appointment details: ' + JSON.stringify(${JSON.stringify(apt).replace(/"/g, '&quot;')}, null, 2))">View Details</button>
                </div>
            </div>
        `).join('');
        console.log('Rendered ' + app.filteredAppointments.length + ' appointments');
    },

    // Cancel appointment
    cancelAppointmentAction: async (appointmentId) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        app.showLoading(true);
        try {
            const response = await API.cancelAppointment(appointmentId);

            if (response.error) {
                throw new Error(response.message || 'Failed to cancel appointment');
            }

            app.showNotification('Appointment cancelled successfully', 'success');
            app.loadAppointments();
        } catch (error) {
            app.showNotification(error.message || 'Failed to cancel appointment', 'error');
        } finally {
            app.showLoading(false);
        }
    },

    // Load profile
    loadProfile: async () => {
        try {
            app.showLoading(true);
            const response = await API.getProfile();

            if (!response.error && response.user) {
                const user = response.user;
                document.getElementById('profile-name').value = user.name || '';
                document.getElementById('profile-email').value = user.email || '';
                document.getElementById('profile-phone').value = user.phone || '';
                document.getElementById('profile-age').value = user.age || '';
                document.getElementById('profile-blood-type').value = user.bloodType || '';
                document.getElementById('profile-allergies').value = user.allergies || '';
                document.getElementById('profile-medical-history').value = user.medicalHistory || '';
            } else {
                // Use local user data if API fails
                const user = app.currentUser;
                document.getElementById('profile-name').value = user.name || '';
                document.getElementById('profile-email').value = user.email || '';
                document.getElementById('profile-phone').value = user.phone || '';
            }
        } catch (error) {
            console.warn('Could not load profile:', error);
        } finally {
            app.showLoading(false);
        }
    },

    // Send chat message
    sendChatMessage: async (e) => {
        e.preventDefault();

        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) {
            return;
        }

        // Add user message to chat
        const chatMessages = document.getElementById('chat-messages');
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'chat-message user-message';
        userMsgDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(userMsgDiv);

        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        app.showLoading(true);

        try {
            const response = await API.askAI(message);

            if (response.error) {
                throw new Error(response.message || 'Failed to get AI response');
            }

            // Add bot response
            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'chat-message bot-message';
            botMsgDiv.innerHTML = `<p>${response.response}</p>`;
            chatMessages.appendChild(botMsgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            // Add error message
            const errorMsgDiv = document.createElement('div');
            errorMsgDiv.className = 'chat-message bot-message';
            errorMsgDiv.innerHTML = `<p>Sorry, I encountered an error. Please try again. ${error.message}</p>`;
            chatMessages.appendChild(errorMsgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } finally {
            app.showLoading(false);
        }
    },

    // Logout
    logout: () => {
        if (confirm('Are you sure you want to logout?')) {
            Auth.logout();
            app.showPage('login');
            document.getElementById('login-form').reset();
        }
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    },

    // Show/hide loading spinner
    showLoading: (show) => {
        const spinner = document.getElementById('loading-spinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

# Admin Dashboard Setup & Installation Guide

## Overview
This is a complete admin dashboard for the AI Doctor Appointment System built with React.js on the frontend and Flask on the backend.

## Features Included

### 🔐 Authentication
- Secure admin login with JWT tokens
- Session persistence using localStorage
- Automatic logout after 30 days of inactivity

### 📊 Dashboard
- Real-time statistics (Total Doctors, Appointments, Patients, Completed)
- Recent appointments overview
- Quick action buttons

### 👨‍⚕️ Doctor Management
- View all registered doctors
- Add new doctors to the system
- Edit doctor information
- Delete doctors
- Search and filter doctors by specialization

### 📅 Appointment Management
- View all appointments
- Filter by status (pending, confirmed, completed, cancelled)
- Update appointment status
- Delete appointments
- View appointment details

### 👥 Patient Management
- View all patients
- Add new patients
- Edit patient information
- Delete patient records
- Track patient medical history

### ⚙️ System Settings
- Configure clinic information (name, email, phone)
- Timezone settings
- Appointment duration configuration
- Enable/disable notifications
- Maintenance mode toggle

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` file in the root directory:
```
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_secret_key
FLASK_ENV=development
```

#### Run Flask Backend
```bash
cd backend
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

#### Install Node Dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Run React Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Alternative: Docker Setup

Build and run using Docker:
```bash
docker build -t admin-dashboard .
docker run -p 5000:5000 -p 3000:3000 admin-dashboard
```

## Login Credentials (Demo)

**Email:** admin@example.com  
**Password:** admin123

*Note: These credentials are for demo purposes. Change them in production.*

## Project Structure

```
ai-doctor-appointment-system/
├── src/
│   ├── components/
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── Navbar.js           # Top navigation bar
│   │   └── StatsCard.js        # Statistics card component
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   ├── Dashboard.js        # Main dashboard
│   │   ├── DoctorManagement.js # Doctor CRUD operations
│   │   ├── AppointmentManagement.js # Appointment management
│   │   ├── PatientManagement.js # Patient management
│   │   └── SystemSettings.js   # System configuration
│   ├── services/
│   │   └── api.js              # API communication layer
│   ├── App.js                  # Main App component
│   ├── App.css                 # App styles
│   └── index.js                # React entry point
├── public/
│   ├── admin-index.html        # HTML template
│   └── index.html              # Index file
├── backend/
│   ├── app.py                  # Flask application
│   └── db.py                   # MongoDB configuration
├── package.json                # Node dependencies
├── requirements.txt            # Python dependencies
└── Dockerfile                  # Docker configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get specific doctor
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update status
- `DELETE /api/appointments/:id` - Delete appointment

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get specific patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-appointments` - Get recent appointments

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

## Technology Stack

### Frontend
- React.js 18
- React Router v6
- Bootstrap 5
- Axios (HTTP client)
- React Icons
- Recharts (for charts)

### Backend
- Flask (Python web framework)
- Flask-CORS (Cross-origin requests)
- Flask-JWT-Extended (Authentication)
- PyMongo (MongoDB connection)
- BCrypt (Password hashing)

### Database
- MongoDB Atlas (Cloud)

## Features Implemented

✅ Admin authentication with JWT tokens  
✅ Dashboard with real-time statistics  
✅ Complete Doctor CRUD operations  
✅ Appointment management with status updates  
✅ Patient management  
✅ System settings configuration  
✅ Responsive design for all screen sizes  
✅ Error handling and validation  
✅ Database persistence  
✅ Search and filter functionality  

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Token-based API authorization
- Secure session management
- Input validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
- Backend: `lsof -i :5000` or `netstat -ano | findstr :5000`
- Frontend: `lsof -i :3000` or `netstat -ano | findstr :3000`

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure network access is enabled

### CORS Errors
- Backend CORS is configured for all origins in development
- Update `CORS()` function in `app.py` for production

### Authentication Failures
- Clear localStorage and login again
- Check token expiration (30 days)
- Verify admin credentials

## Future Enhancements

- Patient appointment booking system
- Email notifications
- SMS notifications
- Advanced analytics and reporting
- Admin user role management
- Audit logs
- Payment integration
- Doctor availability scheduling
- Automated appointment reminders

## Support

For issues or questions, please create an issue in the repository or contact the development team.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Last Updated:** April 2026
**Version:** 1.0.0

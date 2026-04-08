# Admin Dashboard - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js installed
- Python 3.8+ installed
- MongoDB Atlas account (already configured)

### Method 1: Automated Startup (Windows)
```bash
start-dev.bat
```

### Method 2: Automated Startup (Linux/Mac)
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Method 3: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm start
```

## Access the Dashboard

- **URL:** http://localhost:3000
- **Email:** admin@example.com
- **Password:** admin123

## What's Included

✅ Complete Admin Dashboard with 5 main sections:
- Dashboard (with statistics and recent appointments)
- Doctor Management (CRUD operations)
- Appointment Management (status updates, filtering)
- Patient Management (full patient database)
- System Settings (clinic configuration)

✅ Features:
- JWT Authentication
- Responsive design (mobile, tablet, desktop)
- Real-time data synchronization
- Search and filter functionality
- Modal forms for add/edit operations
- Status management
- Complete CRUD operations

## API Endpoints

All endpoints require JWT authentication (Bearer token in Authorization header)

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Doctors
- `GET /api/doctors` - List all
- `POST /api/doctors` - Create
- `PUT /api/doctors/:id` - Update
- `DELETE /api/doctors/:id` - Delete

### Appointments
- `GET /api/appointments` - List all
- `POST /api/appointments` - Create
- `GET /api/appointments/:id` - Get details
- `PUT /api/appointments/:id` - Update
- `PATCH /api/appointments/:id/status` - Update status
- `DELETE /api/appointments/:id` - Delete

### Patients
- `GET /api/patients` - List all
- `POST /api/patients` - Create
- `PUT /api/patients/:id` - Update
- `DELETE /api/patients/:id` - Delete

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/recent-appointments` - Recent appointments

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Directory Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── Sidebar.js
│   │   ├── Navbar.js
│   │   └── StatsCard.js
│   ├── pages/               # Page components
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── DoctorManagement.js
│   │   ├── AppointmentManagement.js
│   │   ├── PatientManagement.js
│   │   └── SystemSettings.js
│   ├── services/            # API communication
│   │   └── api.js
│   ├── App.js
│   └── index.js
├── backend/
│   ├── app.py               # Flask application
│   └── db.py                # MongoDB setup
├── public/
│   └── index.html           # HTML template
├── package.json             # Node dependencies
└── requirements.txt         # Python dependencies
```

## Development

### Adding a New Doctor
1. Go to Doctor Management
2. Click "Add Doctor" button
3. Fill in the form
4. Click "Add Doctor"

### Viewing Appointments
1. Go to Appointments
2. Filter by status if needed
3. Click "Complete" to mark as done
4. Click "Delete" to remove

### Managing System Settings
1. Go to Settings
2. Update clinic information
3. Configure appointment duration
4. Toggle notifications
5. Click "Save Settings"

## Troubleshooting

### Port 5000 in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Port 3000 in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Error
- Check `.env` file has correct MONGO_URI
- Verify IP is whitelisted in MongoDB Atlas
- Test connection in Python:
```python
from pymongo import MongoClient
client = MongoClient('your_connection_string')
print(client.server_info())
```

### Login Fails
- Clear browser localStorage: F12 → Application → localStorage → Clear
- Refresh page and try again
- Verify backend is running on http://localhost:5000

## Next Steps

1. **Customize Credentials:** Update admin user in `backend/db.py`
2. **Configure Email:** Set up email notifications in `SystemSettings`
3. **Add More Features:** Extend the API and add new components
4. **Deploy:** Use Docker or cloud deployment options
5. **Production Setup:** Change secret key, enable HTTPS, update CORS

## Support & Documentation

For complete documentation, see [ADMIN_DASHBOARD_README.md](./ADMIN_DASHBOARD_README.md)

---

**Dashboard Version:** 1.0.0  
**Last Updated:** April 2026

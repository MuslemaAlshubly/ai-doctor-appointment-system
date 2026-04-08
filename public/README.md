# Frontend - AI Doctor Appointment System

A modern, responsive web application frontend for booking doctor appointments and receiving AI-powered medical guidance.

## Features

### Authentication
- User registration and login
- Secure token-based authentication
- Session management

### Appointment Management
- Book appointments with doctors
- View upcoming and completed appointments
- Cancel appointments
- Display appointment history

### AI Medical Consultation
- Chat-based AI medical consultation (powered by Gemini API)
- Ask health-related questions
- Receive general medical guidance
- Consultation history tracking

### User Profile
- View and edit profile information
- Store medical history and allergies
- Blood type information
- Personal health details

### Dashboard
- Overview of upcoming appointments
- Statistics on appointments and consultations
- Quick access to key features

## Tech Stack

- **HTML/CSS/JavaScript** - Frontend framework
- **Fetch API** - API communication
- **Local Storage** - Client-side data persistence
- **Google Generative AI** - AI-powered medical consultation

## File Structure

```
public/
├── index.html          # Main HTML file with all pages
├── styles.css          # Complete styling (responsive design)
└── js/
    ├── app.js          # Main application logic
    ├── api.js          # API communication layer
    └── auth.js         # Authentication management
```

## Setup & Installation

### 1. Backend Requirements
Ensure the Flask backend is running on `http://localhost:5000` with these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get appointments
- `DELETE /api/appointments/:id` - Cancel appointment
- `POST /api/ai/ask` - Ask AI a question
- `GET /api/dashboard/stats` - Get dashboard statistics

### 2. Start the Frontend

Simply open `public/index.html` in a web browser or serve it with a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server public

# Using PHP
php -S localhost:8000 -t public
```

Then navigate to `http://localhost:8000` (or your chosen port)

## Features in Detail

### 1. Authentication
- Secure login and registration
- Token-based session management
- Automatic redirect to login if not authenticated

### 2. Dashboard
- Displays overall statistics
- Shows upcoming appointments
- Quick action buttons
- Welcome message with user name

### 3. Book Appointment
- Select from available doctors
- Choose preferred date and time
- Add reason for visit
- Optional additional notes

### 4. My Appointments
- View all appointments
- Filter by status (upcoming, completed, all)
- Cancel upcoming appointments
- View appointment details

### 5. AI Consultation
- Real-time chat interface
- Ask medical questions
- Receive AI-powered responses
- Scroll-based chat history
- Clean, intuitive UI

### 6. Profile Management
- Edit personal information
- Add medical history
- Store allergies and health conditions
- Blood type selection
- Age and contact information

## Styling

The frontend uses a modern, professional design with:

- **Color Scheme**: Professional blue primary color (#2563eb)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Sidebar Navigation**: Easy navigation between pages
- **Card-based Layout**: Clean and organized content display
- **Smooth Animations**: Transitions and slide-in effects
- **Accessibility**: Good contrast and readability

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Configuration

The API base URL is configured in `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Update this if your backend is running on a different host or port.

## Future Enhancements

- [ ] Doctor profiles and availability
- [ ] Online appointment confirmation
- [ ] Email notifications
- [ ] Appointment reminders
- [ ] Payment integration
- [ ] Prescription management
- [ ] Medical reports storage
- [ ] Telemedicine integration
- [ ] Mobile app (React Native/Flutter)

## Support

For issues or questions about the frontend, please refer to the main project README or contact the frontend developer.

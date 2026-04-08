# Frontend Developer Guide

## Quick Start

### Option 1: Open in Browser (Simplest)
```bash
# Windows: Open file directly
start public\index.html

# Mac/Linux: Open with default browser
open public/index.html
```

### Option 2: Python Server
```bash
# Python 3
cd public && python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then open: http://localhost:8000
```

### Option 3: Node.js Server
```bash
# Using http-server package
npx http-server public

# Or install globally first
npm install -g http-server
http-server public
```

### Option 4: PHP Server
```bash
php -S localhost:8000 -t public
```

## Project Structure

### HTML File (`public/index.html`)
Single-page application with all views:
- **Login Page**: User authentication form
- **Register Page**: New user registration
- **Dashboard**: Overview and quick stats
- **Book Appointment**: Appointment scheduling form
- **My Appointments**: List and manage appointments
- **AI Consultation**: Chat interface for medical questions
- **Profile**: User profile management

### CSS File (`public/styles.css`)
Complete styling with:
- CSS variables for consistent theming
- Responsive grid layouts
- Mobile-first design approach
- Smooth animations and transitions
- Dark mode ready structure

### JavaScript Files

#### `js/api.js` - API Communication
```javascript
// Provides API functions for all endpoints
API.login(email, password)
API.register(userData)
API.getProfile()
API.updateProfile(userData)
API.bookAppointment(data)
API.getAppointments(status)
API.cancelAppointment(id)
API.askAI(question)
API.getConsultationHistory()
API.getDashboardStats()
```

#### `js/auth.js` - Authentication Management
```javascript
// Handles authentication state
Auth.isAuthenticated()
Auth.getUser()
Auth.setAuth(token, user)
Auth.clearAuth()
Auth.login(email, password)
Auth.register(name, email, password, phone)
Auth.logout()
```

#### `js/app.js` - Application Logic
```javascript
// Main application controller
app.init()                           // Initialize on page load
app.showPage(pageName)               // Navigate between pages
app.handleLogin(e)                   // Login handler
app.handleRegister(e)                // Registration handler
app.handleBookAppointment(e)         // Appointment booking
app.handleProfileUpdate(e)           // Profile update
app.loadDashboard()                  // Load dashboard data
app.loadAppointments()               // Load appointments list
app.filterAppointments(status)       // Filter by status
app.sendChatMessage(e)               // Send AI chat message
app.logout()                         // Logout handler
app.showNotification(msg, type)      // Show notifications
app.showLoading(show)                // Toggle loading spinner
```

## Configuration

### Backend URL
Edit in `js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Colors & Theming
Edit in `styles.css` (CSS Variables):
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --success-color: #059669;
    --error-color: #dc2626;
    /* ... more colors ... */
}
```

## Common Tasks

### Add a New Page
1. Add HTML in `index.html`:
```html
<div id="new-page" class="content-page">
    <!-- Your content -->
</div>
```

2. Add navigation link in sidebar:
```html
<a href="#" class="nav-item" onclick="app.showPage('new-page'); return false;">
    <span class="icon">📌</span>
    <span>New Page</span>
</a>
```

3. Add page display logic in `app.showPage()`:
```javascript
const titles = {
    'new-page': 'Page Title'
};
```

### Add a Form
Create form HTML with proper IDs and add handler:
```javascript
const form = document.getElementById('form-id');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Handle form submission
});
```

### Call API
```javascript
try {
    const response = await API.functionName(params);
    if (response.error) {
        throw new Error(response.message);
    }
    // Handle success
} catch (error) {
    app.showNotification(error.message, 'error');
}
```

## Debugging

### Browser Console
Open browser DevTools (F12) to see:
- Network requests
- Console errors
- Application data in Local Storage
- Performance metrics

### Local Storage
Check stored user data:
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
JSON.parse(localStorage.getItem('user'))
```

### API Testing
Test API endpoints:
```javascript
// In browser console
fetch('http://localhost:5000/api/health')
    .then(r => r.json())
    .then(d => console.log(d))
```

## Performance Tips

1. **Lazy Load Images**: Add images only when needed
2. **Minimize API Calls**: Cache data when possible
3. **Optimize CSS**: Currently at ~1500 lines but highly organized
4. **Code Splitting**: Consider breaking into multiple files for larger projects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing

### Manual Testing Checklist
- [ ] Login with invalid credentials
- [ ] Register new account
- [ ] Book appointment with future date
- [ ] View and filter appointments
- [ ] Ask AI a question
- [ ] Update profile information
- [ ] Logout and login again
- [ ] Check responsive design on mobile

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## Troubleshooting

### "API Connection Error"
- Check backend is running on correct port
- Verify API_BASE_URL in js/api.js
- Check CORS headers in Flask backend

### "Token not found"
- User not authenticated
- Check Local Storage in DevTools
- Clear browser data and re-login

### "Page not loading"
- Check HTML element IDs match
- Verify JavaScript file references
- Check browser console for errors

## Future Enhancements

- [ ] Add offline support (Service Workers)
- [ ] Implement pagination for large lists
- [ ] Add advanced search/filtering
- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)

## Dependencies

Current frontend has **ZERO external dependencies** - just vanilla HTML/CSS/JS!

### Optional Packages (not required)
- `chart.js` - For dashboard analytics
- `date-fns` - For date formatting
- `axios` - Alternative to Fetch API
- `vue/react` - If modernizing later

## Code Style

- **Naming**: camelCase for JS, kebab-case for CSS
- **Comments**: Use for complex logic
- **Indentation**: 4 spaces
- **Line Length**: Keep under 100 characters where possible
- **Consistency**: Follow existing patterns

---

**Happy Coding! 🚀**

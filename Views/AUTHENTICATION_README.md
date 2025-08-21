# Authentication System Documentation

## Overview
This application implements a simple client-side authentication system using localStorage to persist user sessions.

## How It Works

### 1. Login Flow
- User enters username and password on the homepage
- On successful login, the username is stored in localStorage
- User is automatically redirected to `/dashboard`
- The `isLoggedIn` flag is set to `true` in localStorage

### 2. Dashboard Access
- The dashboard is protected by a `ProtectedRoute` component
- Only authenticated users can access `/dashboard`
- If an unauthenticated user tries to access the dashboard, they're redirected to the homepage

### 3. Session Persistence
- User sessions persist across browser refreshes and navigation
- Users can use the browser's back/forward buttons without being logged out
- The only way to logout is by clicking the logout button

### 4. Logout
- Clicking the logout button clears all authentication data from localStorage
- User is redirected back to the homepage
- All session data is completely removed

## Security Features

### Protected Routes
- Dashboard route is wrapped with `ProtectedRoute` component
- Authentication is checked on every route access
- Invalid or expired sessions are automatically cleared

### Session Validation
- Both `username` and `isLoggedIn` flags must be present and valid
- Invalid localStorage data is automatically cleaned up
- Users are redirected to login if authentication fails

## File Structure

```
Views/src/
├── App.jsx              # Main routing configuration
├── homepage.jsx         # Login page
├── dashboard.jsx        # Protected dashboard component
├── ProtectedRoute.jsx   # Authentication wrapper component
└── dashboard.css        # Dashboard styling
```

## Usage

### For Users
1. Navigate to the homepage (`/`)
2. Enter your username and password
3. Upon successful login, you'll be redirected to the dashboard
4. Use the logout button to end your session

### For Developers
- Add new protected routes by wrapping them with `<ProtectedRoute>`
- Authentication state is available in localStorage
- Use `navigate('/dashboard')` to redirect authenticated users
- Use `navigate('/')` to redirect unauthenticated users

## Browser Compatibility
- Uses localStorage for session persistence
- Works with all modern browsers
- Session persists until explicit logout or localStorage is cleared

## Future Enhancements
- Add session expiration
- Implement refresh tokens
- Add remember me functionality
- Add multi-factor authentication
- Implement proper backend session management 
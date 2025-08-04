import { useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation - in a real app, this would connect to a backend
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // For now, just show success message
    setError('');
    setPassword(''); // Clear password for security
    alert('Login successful! (Dashboard functionality coming soon)');
  };

  return (
    <div className="homepage">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>TodayToDoList</h1>
            <p>Login to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (isLoggedIn === 'true' && storedUsername) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
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
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPassword(''); // Clear password for security
        // Store authentication data in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('isLoggedIn', 'true');
        if (data && data.user && (data.user.id || data.user.user_id)) {
          const userId = data.user.id || data.user.user_id;
          localStorage.setItem('userId', String(userId));
        }
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>} 
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Simple validation
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
    alert('Signup successful! (Database implementation coming soon)');
  };

  return (
    <div className="homepage">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>TodayToDoList</h1>
            <p>Create your account</p>
          </div>
          
          <form onSubmit={handleSignup} className="login-form">
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
              Sign Up
            </button>
          </form>
          
          <div className="login-footer">
            <p>Already have an account? <Link to="/" className="signup-link">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
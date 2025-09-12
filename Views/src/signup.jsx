import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './homepage.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
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
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPassword('');
        setUsername('');
        setProfileImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert('Signup successful! Please log in.');
        navigate('/');
      } else {
        setError(data.error || 'Signup failed. Please try again.');
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

            <div className="form-group">
              <label htmlFor="profileImage">Profile Picture (optional)</label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                ref={fileInputRef}
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
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
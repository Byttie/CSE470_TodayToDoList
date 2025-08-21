import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    // Redirect to login page
    navigate('/');
  };



  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to TodayToDoList</h1>
          <div className="user-info">
            <span className="username">Hello, {username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="welcome-message">
            <h2>Dashboard</h2>
            <p>This is your personal dashboard. Features will be added here later.</p>
            <p>You can only logout by clicking the logout button above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dash-topbar">
          <div className="dash-left">
            <div className="user-badge" title={username}>
              <div className="user-avatar">{username ? username.charAt(0).toUpperCase() : '?'}</div>
              <span className="user-name">{username}</span>
            </div>
          </div>
          <div className="dash-right">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        <main className="dash-main">
          <div className="center-hero">
            <h1 className="app-title">TodayToDoList</h1>
            <div className="clock-placeholder">Clock goes here</div>
          </div>

          <nav className="dash-nav">
            <Link className="nav-card" to="/tasks">
              <div className="nav-title">My Tasks</div>
              <div className="nav-desc">Add, delete and view your tasks</div>
            </Link>
            <Link className="nav-card" to="/shop">
              <div className="nav-title">Shop</div>
              <div className="nav-desc">Coming soon</div>
            </Link>
            <Link className="nav-card" to="/social">
              <div className="nav-title">Social</div>
              <div className="nav-desc">Coming soon</div>
            </Link>
          </nav>

          {error && <div className="task-error" style={{ marginTop: 16 }}>{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 
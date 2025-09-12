import Clock from './Clock';
import PointsDisplay from './PointsDisplay';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedUserId) {
      fetchProfile(storedUserId);
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/profile/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setProfileImage(data.profileImage || '');
      }
    } catch (e) {
    }
  };

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
            <div className="user-badge" title={username} onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="user-avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div className="user-avatar">{username ? username.charAt(0).toUpperCase() : '?'}</div>
              )}
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
            <Clock />
          </div>

          <PointsDisplay />

          <nav className="dash-nav">
            <Link className="nav-card" to="/tasks">
              <div className="nav-title">My Tasks</div>
              <div className="nav-desc">Add, delete and view your tasks</div>
            </Link>
            <Link className="nav-card" to="/shop">
              <div className="nav-title">Shop</div>
              <div className="nav-desc">Redeem points for timed rewards</div>
            </Link>
            <Link className="nav-card" to="/social">
              <div className="nav-title">Social</div>
              <div className="nav-desc">Create and join community forums</div>
            </Link>
          </nav>

          {error && <div className="task-error" style={{ marginTop: 16 }}>{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 
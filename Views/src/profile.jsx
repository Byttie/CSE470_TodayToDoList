import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) fetchProfile(storedUserId);
  }, []);

  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/profile/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
      setProfileImage(data.profileImage || '');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:3000/profile/${userId}/image`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile image');
      setProfileImage(data.imagePath);
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:3000/profile/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: passwordForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
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
          <div className="dash-right">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        <div className="dashboard-header">
          <h1>Edit Profile</h1>
          <div className="user-info" style={{ justifyContent: 'flex-end' }}>
            <button onClick={handleBack} className="logout-btn">Back to Dashboard</button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="welcome-message">
            {loading ? (
              <div className="loading">Loading profile...</div>
            ) : (
              <>
                <div className="task-add-section">
                  <h3 className="task-title">Profile Picture</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div className="profile-image-container">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="profile-image"
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                          {username ? username.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={updating}
                        style={{ marginBottom: '10px' }}
                      />
                      <br />
                      <small>Upload a new profile picture</small>
                    </div>
                  </div>
                </div>

                <div className="task-add-section">
                  <h3 className="task-title">Change Password</h3>
                  <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="task-button" disabled={updating}>
                      {updating ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                <div className="task-add-section">
                  <h3 className="task-title">Account Information</h3>
                  <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <p><strong>Username:</strong> {username}</p>
                  </div>
                </div>

                {error && <div className="task-error" style={{ marginTop: 20 }}>{error}</div>}
                {success && <div style={{ color: '#16a34a', marginTop: 20, padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>{success}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

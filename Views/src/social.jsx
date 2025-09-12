import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ForumDiscussion from './ForumDiscussion';
import './social.css';

const Social = () => {
  const [forums, setForums] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredForums, setFilteredForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedSelectedForum = localStorage.getItem('selectedForum');
    
    if (storedUserId) {
      setUserId(storedUserId);
      fetchForums();
      
      // Restore selected forum if it exists
      if (storedSelectedForum) {
        try {
          const forum = JSON.parse(storedSelectedForum);
          setSelectedForum(forum);
        } catch (error) {
          localStorage.removeItem('selectedForum');
        }
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredForums(forums);
    } else {
      const filtered = forums.filter(forum => 
        forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredForums(filtered);
    }
  }, [searchTerm, forums]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/forums');
      const data = await response.json();
      if (response.ok) {
        setForums(data.forums);
        setFilteredForums(data.forums);
      } else {
        setError('Failed to fetch forums');
      }
    } catch (err) {
      setError('Error fetching forums');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    if (!newForum.title.trim() || !newForum.description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: newForum.title,
          description: newForum.description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Forum created successfully!');
        setNewForum({ title: '', description: '' });
        setShowCreateForm(false);
        fetchForums(); // Refresh the forums list
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to create forum');
      }
    } catch (err) {
      setError('Error creating forum');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForum = async (forumId) => {
    if (!window.confirm('Are you sure you want to delete this forum?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/forums/${forumId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Forum deleted successfully!');
        fetchForums(); // Refresh the forums list
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to delete forum');
      }
    } catch (err) {
      setError('Error deleting forum');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewForum = (forum) => {
    setSelectedForum(forum);
    localStorage.setItem('selectedForum', JSON.stringify(forum));
  };

  const handleBackToForums = () => {
    setSelectedForum(null);
    localStorage.removeItem('selectedForum');
  };

  return (
    <div className="social-container">
      {!selectedForum && (
        <div className="social-header">
          <h1>Community Forums</h1>
          <p>Share your progress, ask questions, and connect with other users!</p>
          <div className="header-actions">
            <Link to="/dashboard" className="back-to-dashboard-btn">
              ← Back to Dashboard
            </Link>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search forums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button 
              className="create-forum-btn"
              onClick={() => setShowCreateForm(true)}
              disabled={loading}
            >
              Create New Forum
            </button>
          </div>
        </div>
      )}

      {selectedForum && (
        <div className="social-header">
          <div className="header-actions">
            <Link to="/dashboard" className="back-to-dashboard-btn">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
          <button onClick={() => setSuccess('')} className="close-btn">×</button>
        </div>
      )}

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Forum</h2>
            <form onSubmit={handleCreateForum}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={newForum.title}
                  onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                  placeholder="Enter forum title..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={newForum.description}
                  onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                  placeholder="Describe what this forum is about..."
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Forum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!selectedForum && (
        <div className="forums-list">
          {loading && forums.length === 0 ? (
            <div className="loading">Loading forums...</div>
          ) : filteredForums.length === 0 && searchTerm ? (
            <div className="no-forums">
              <h3>No forums found!</h3>
              <p>Try searching with different keywords.</p>
            </div>
          ) : filteredForums.length === 0 ? (
            <div className="no-forums">
              <h3>No forums yet!</h3>
              <p>Be the first to create a forum and start the conversation.</p>
            </div>
          ) : (
            filteredForums.map((forum) => (
              <div key={forum.forumid} className="forum-card">
                <div className="forum-header">
                  <h3 className="forum-title">{forum.title}</h3>
                  <div className="forum-meta">
                    <div className="author-info">
                      {forum.profile_image_url ? (
                        <img 
                          src={forum.profile_image_url} 
                          alt="Profile" 
                          className="author-avatar"
                        />
                      ) : (
                        <div className="author-avatar">
                          {forum.username ? forum.username.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <span className="forum-author">by {forum.username || 'Anonymous'}</span>
                    </div>
                    <span className="forum-date">{formatDate(forum.created_at)}</span>
                  </div>
                </div>
                <div className="forum-description">
                  {forum.description}
                </div>
                <div className="forum-actions">
                  <button 
                    className="view-forum-btn"
                    onClick={() => handleViewForum(forum)}
                  >
                    View Discussion
                  </button>
                  {forum.id === parseInt(userId) && (
                    <button 
                      className="delete-forum-btn"
                      onClick={() => handleDeleteForum(forum.forumid)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedForum && (
        <ForumDiscussion 
          forum={selectedForum}
          onBack={handleBackToForums}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Social; 
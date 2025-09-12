import { useState, useEffect } from 'react';
import './ForumDiscussion.css';

const ForumDiscussion = ({ forum, onBack, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (forum) {
      fetchComments();
    }
  }, [forum]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/comments/forum/${forum.forumid}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      setError('Error loading comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          forumId: forum.forumid,
          comment: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Comment added successfully!');
        setNewComment('');
        fetchComments(); // Refresh comments
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add comment');
      }
    } catch (err) {
      setError('Error adding comment');
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

  if (!forum) return null;

  return (
    <div className="forum-discussion">
      <div className="discussion-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Forums
        </button>
        <h2>{forum.title}</h2>
        <p className="forum-description">{forum.description}</p>
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
          <span className="forum-date">Just now</span>
        </div>
      </div>

      <div className="comments-section">
        <h3>Discussion ({comments.length} comments)</h3>
        
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
        
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows="3"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {commentsLoading ? (
            <div className="loading">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={comment.commentid || index} className="comment-item">
                <div className="comment-author">
                  {comment.profile_image_url ? (
                    <img 
                      src={comment.profile_image_url} 
                      alt="Profile" 
                      className="comment-avatar"
                    />
                  ) : (
                    <div className="comment-avatar">
                      {comment.username ? comment.username.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                    <div className="comment-info">
                      <span className="comment-username">{comment.username || 'Anonymous'}</span>
                      <span className="comment-date">
                        {comment.created_at ? formatDate(comment.created_at) : 'Just now'}
                      </span>
                    </div>
                </div>
                <div className="comment-content">
                  {comment.comment}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDiscussion;

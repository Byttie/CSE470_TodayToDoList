import { useState, useEffect } from 'react';
import './PointsDisplay.css';

const PointsDisplay = ({ refreshTrigger }) => {
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState('Bronze');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserPoints();
  }, [refreshTrigger]);

  const fetchUserPoints = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/points/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch points');
      }
      
      setPoints(data.points);
      setRank(data.rank);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      default: return '#6b7280';
    }
  };

  const getRankEmoji = (rank) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'diamond': return '💠';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="points-display">
        <div className="points-loading">Loading points...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="points-display">
        <div className="points-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="points-display">
      <div className="points-info">
        <div className="points-value">
          <span className="points-label">Points:</span>
          <span className="points-number">{points}</span>
        </div>
        <div className="rank-info">
          <span className="rank-emoji">{getRankEmoji(rank)}</span>
          <span 
            className="rank-text"
            style={{ color: getRankColor(rank) }}
          >
            {rank}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;

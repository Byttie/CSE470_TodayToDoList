import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SmallTimer from './SmallTimer';
import PointsDisplay from './PointsDisplay';
import './dashboard.css';

const Shop = () => {
  const [username, setUsername] = useState('');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', hours: '', minutes: '' });
  const [pointsRefreshTrigger, setPointsRefreshTrigger] = useState(0);
  const startedRewardsRef = useRef(new Set());
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
    fetchRewards();
  }, []);

  const hasPersist = (rewardId) => {
    try { return Boolean(localStorage.getItem(`reward_timer_${rewardId}`)); } catch (_) { return false; }
  };

  const syncStartedFromStorage = (list) => {
    const next = new Set();
    list.forEach((r) => {
      if (hasPersist(r.rewardid)) next.add(r.rewardid);
    });
    startedRewardsRef.current = next;
  };

  const fetchRewards = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/rewards?userId=${Number(userId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch rewards');
      const list = Array.isArray(data.rewards) ? data.rewards : [];
      setRewards(list);
      syncStartedFromStorage(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }
    if (!form.title.trim()) {
      setError('Reward title is required');
      return;
    }
    if ((form.hours === '' || form.hours === null) && (form.minutes === '' || form.minutes === null)) {
      setError('Hours or minutes is required');
      return;
    }
    const hoursNum = Number(form.hours || 0);
    const minutesNum = Number(form.minutes || 0);
    if (!Number.isFinite(hoursNum) || hoursNum < 0) {
      setError('Hours must be 0 or more');
      return;
    }
    if (!Number.isFinite(minutesNum) || minutesNum < 0 || minutesNum > 59) {
      setError('Minutes must be between 0 and 59');
      return;
    }
    const totalMinutes = hoursNum * 60 + minutesNum;
    if (totalMinutes <= 0) {
      setError('Total time must be greater than 0');
      return;
    }
    setError('');
    setCreating(true);
    try {
      const res = await fetch('http://localhost:3000/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), title: form.title.trim(), minutes: totalMinutes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create reward');
      setForm({ title: '', hours: '', minutes: '' });
      await fetchRewards();
      setPointsRefreshTrigger((x) => x + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (rewardId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const hasStarted = startedRewardsRef.current.has(rewardId) || hasPersist(rewardId);
    const refund = !hasStarted; // refund only if not started (even after refresh)
    try {
      const res = await fetch(`http://localhost:3000/rewards/${rewardId}?userId=${Number(userId)}&refund=${refund}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete reward');
      setRewards((prev) => prev.filter((r) => r.rewardid !== rewardId));
      if (refund) {
        setPointsRefreshTrigger((x) => x + 1);
      }
      try { localStorage.removeItem(`reward_timer_${rewardId}`); } catch (_) {}
      startedRewardsRef.current.delete(rewardId);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleTimerStart = (rewardId) => {
    startedRewardsRef.current.add(rewardId);
  };

  const handleTimerTimeout = (rewardId) => {
    // Reward finished; delete it without refund (started => refund=false)
    handleDelete(rewardId);
  };

  const handleTimerCompletedClick = (rewardId) => {
    // User clicked checkmark: remove immediately without refund
    handleDelete(rewardId);
  };

  const formatTime = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    if (h > 0 && mm > 0) return `${h}h ${mm}m`;
    if (h > 0) return `${h}h`;
    return `${mm}m`;
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
        </header>

        <div className="dashboard-header">
          <h1>Reward Shop</h1>
          <div className="user-info" style={{ justifyContent: 'flex-end' }}>
            <button onClick={handleBack} className="logout-btn">Back to Dashboard</button>
          </div>
        </div>

        <PointsDisplay refreshTrigger={pointsRefreshTrigger} />

        <div className="dashboard-content">
          <div className="welcome-message">
            <div className="task-add-section">
              <h3 className="task-title">Create a Reward (1 point = 1 minute)</h3>
              <form onSubmit={handleCreate} className="task-row" style={{ gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Reward title (e.g., Break, YouTube)"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  style={{ padding: '8px 12px', minWidth: 240 }}
                />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Hours"
                    value={form.hours}
                    onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value.replace(/[^0-9]/g, '') }))}
                    style={{ padding: '8px 12px', width: 100 }}
                  />
                  <span>h</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Minutes"
                    value={form.minutes}
                    onChange={(e) => setForm((f) => ({ ...f, minutes: e.target.value.replace(/[^0-9]/g, '') }))}
                    style={{ padding: '8px 12px', width: 120 }}
                  />
                  <span>m</span>
                </div>
                <button className="task-button" type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Reward'}
                </button>
              </form>
              <small>Example: 0h 30m costs 30 points. 1h 15m costs 75 points.</small>
              {error && <div className="task-error" style={{ marginTop: 12 }}>{error}</div>}
            </div>

            <div className="task-list" style={{ marginTop: 24 }}>
              <h3 className="task-title">Your Rewards</h3>
              {loading ? (
                <div className="loading">Loading rewards...</div>
              ) : rewards.length === 0 ? (
                <div className="no-tasks">No rewards yet</div>
              ) : (
                <ul>
                  {rewards.map((r) => (
                    <li key={r.rewardid} className="task-item">
                      <div className="task-content">
                        <div className="task-header">
                          <span className="task-name">{r.title}</span>
                          <span className="task-priority" style={{ color: '#16a34a' }}>{formatTime(Number(r.rewardpoint))}</span>
                        </div>
                        <div className="task-meta">
                          <SmallTimer
                            taskId={r.rewardid}
                            taskTime={Number(r.rewardpoint) / 60}
                            taskName={r.title}
                            onTimerComplete={() => {}}
                            onTaskCompleted={() => handleTimerCompletedClick(r.rewardid)}
                            onTaskTimeout={() => handleTimerTimeout(r.rewardid)}
                            onStart={handleTimerStart}
                            showCompletedMessage={false}
                            persistKey={`reward_timer_${r.rewardid}`}
                          />
                        </div>
                      </div>
                      <button className="task-delete" onClick={() => handleDelete(r.rewardid)}>Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from './Clock';
import AddTaskModal from './AddTaskModal';
import SmallTimer from './SmallTimer';
import PointsDisplay from './PointsDisplay';
import './dashboard.css';

const Tasks = () => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [error, setError] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingHours, setRemainingHours] = useState(24);
  const [pointsRefreshTrigger, setPointsRefreshTrigger] = useState(0);
  const startedTasksRef = useRef(new Set());
  const navigate = useNavigate();

  // Helper functions for timer persistence
  const hasPersist = (taskId) => {
    try { return Boolean(localStorage.getItem(`task_timer_${taskId}`)); } catch (_) { return false; }
  };

  const syncStartedFromStorage = (list) => {
    const next = new Set();
    list.forEach((t) => {
      if (hasPersist(t.taskid)) next.add(t.taskid);
    });
    startedTasksRef.current = next;
  };

  const handleTimerStart = (taskId) => {
    startedTasksRef.current.add(taskId);
  };

  // Calculate remaining hours until next day
  const calculateRemainingHours = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Round to 2 decimal places for more precision, then round to nearest minute
    return Math.max(0, Math.round(diffHours * 100) / 100);
  };

  // Calculate total time used by existing tasks
  const calculateTotalTimeUsed = () => {
    return tasks.reduce((total, task) => {
      const taskTime = parseFloat(task.time) || 0;
      return total + taskTime;
    }, 0);
  };

  // Calculate available time for new tasks
  const calculateAvailableTime = () => {
    const totalTimeUsed = calculateTotalTimeUsed();
    const timeUntilNextDay = calculateRemainingHours();
    return Math.max(0, timeUntilNextDay - totalTimeUsed);
  };

  // Handle timer completion (timeout)
  const handleTimerComplete = (taskName) => {
    alert(`Timer completed for task: ${taskName}! 🎉`);
    // You can add additional logic here like marking task as completed
  };

  // Handle task completion (user pressed finish button)
  const handleTaskCompleted = async (taskId, taskTime, taskName) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }

    try {
      const taskTimeInMinutes = Math.round(taskTime * 60); // Convert hours to minutes
      const response = await fetch('http://localhost:3000/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          taskId: Number(taskId),
          taskTimeInMinutes: taskTimeInMinutes
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete task');
      }
      
      fetchTasks(); // Refresh the task list
      setPointsRefreshTrigger(prev => prev + 1); // Refresh points display
    } catch (e) {
      setError(e.message);
    }
  };

  // Handle task timeout (timer reached zero)
  const handleTaskTimeout = async (taskId, taskTime, taskName) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }

    try {
      const taskTimeInMinutes = Math.round(taskTime * 60); // Convert hours to minutes
      const response = await fetch('http://localhost:3000/tasks/timeout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          taskId: Number(taskId),
          taskTimeInMinutes: taskTimeInMinutes
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to handle task timeout');
      }
      
      fetchTasks(); // Refresh the task list
      setPointsRefreshTrigger(prev => prev + 1); // Refresh points display
    } catch (e) {
      setError(e.message);
    }
  };

  // Format decimal hours to hours and minutes
  const formatTime = (decimalHours) => {
    if (decimalHours === 0) return "0h 0m";
    
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    // Handle edge case where rounding minutes gives 60
    const finalHours = minutes === 60 ? hours + 1 : hours;
    const finalMinutes = minutes === 60 ? 0 : minutes;
    
    if (finalMinutes === 0) {
      return `${finalHours}h`;
    } else if (finalHours === 0) {
      return `${finalMinutes}m`;
    } else {
      return `${finalHours}h ${finalMinutes}m`;
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) fetchProfile(storedUserId);
    fetchTasks();
    
    // Update remaining hours every second to sync with clock
    const updateRemainingHours = () => {
      setRemainingHours(calculateRemainingHours());
    };
    
    updateRemainingHours();
    const interval = setInterval(updateRemainingHours, 1000); // Update every second
    
    return () => clearInterval(interval);
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

  const fetchTasks = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoadingTasks(true);
    try {
      const res = await fetch(`http://localhost:3000/tasks?userId=${Number(userId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      const list = Array.isArray(data.tasks) ? data.tasks : [];
      setTasks(list);
      syncStartedFromStorage(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleAddTask = async (taskData) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }
    
    setError('');
    setAdding(true);
    try {
      const taskId = Math.floor(Date.now() / 1000);
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: Number(userId), 
          taskId, 
          name: taskData.name,
          description: taskData.description,
          priority: taskData.priority,
          time: taskData.time
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add task');
      }
      setIsModalOpen(false);
      fetchTasks();
      setRemainingHours(calculateRemainingHours());
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setDeletingTaskId(taskId);
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}?userId=${Number(userId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete task');
      setTasks((prev) => prev.filter((t) => t.taskid !== taskId));
      // Clean up persistence data
      try { localStorage.removeItem(`task_timer_${taskId}`); } catch (_) {}
      startedTasksRef.current.delete(taskId);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
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

        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <Clock />
          <div className="user-info" style={{ justifyContent: 'flex-end' }}>
            <button onClick={handleBack} className="logout-btn">Back to Dashboard</button>
          </div>
        </div>
        
        <PointsDisplay refreshTrigger={pointsRefreshTrigger} />
        
        <div className="dashboard-content">
          <div className="welcome-message">
            <div className="task-add-section">
              <h3 className="task-title">Add a task</h3>
              <div className="time-remaining">
                <p>Time remaining until next day: <strong>{formatTime(remainingHours)}</strong></p>
                <p>Time used by existing tasks: <strong>{formatTime(calculateTotalTimeUsed())}</strong></p>
                <p>Available time for new tasks: <strong>{formatTime(calculateAvailableTime())}</strong></p>
              </div>
              <div className="task-row">
                <button 
                  className="task-button" 
                  onClick={() => setIsModalOpen(true)}
                  disabled={adding || calculateAvailableTime() <= 0}
                >
                  {adding ? 'Adding...' : 'Add New Task'}
                </button>
              </div>
              {calculateAvailableTime() <= 0 && (
                <div className="no-time-message">
                  <p>No time remaining for new tasks. Delete existing tasks or wait for the next day!</p>
                </div>
              )}
              {error && <div className="task-error">{error}</div>}
            </div>

            <div className="task-list">
              <h3 className="task-title">Your tasks</h3>
              {loadingTasks ? (
                <div className="loading">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="no-tasks">No tasks yet</div>
              ) : (
                <ul>
                  {tasks.map((t) => (
                    <li key={t.taskid} className="task-item">
                      <div className="task-content">
                        <div className="task-header">
                          <span className="task-name">{t.name || t.task}</span>
                          <span 
                            className="task-priority"
                            style={{ color: getPriorityColor(t.priority) }}
                          >
                            {t.priority || 'medium'}
                          </span>
                        </div>
                        {t.description && (
                          <div className="task-description">{t.description}</div>
                        )}
                        <div className="task-meta">
                          {t.time && <span className="task-time">{formatTime(parseFloat(t.time))}</span>}
                          {t.time && (
                            <SmallTimer
                              taskId={t.taskid}
                              taskTime={parseFloat(t.time) || 0}
                              taskName={t.name || t.task}
                              onTimerComplete={handleTimerComplete}
                              onTaskCompleted={handleTaskCompleted}
                              onTaskTimeout={handleTaskTimeout}
                              onStart={handleTimerStart}
                              persistKey={`task_timer_${t.taskid}`}
                            />
                          )}
                        </div>
                      </div>
                      <button
                        className="task-delete"
                        onClick={() => handleDeleteTask(t.taskid)}
                        disabled={deletingTaskId === t.taskid}
                      >
                        {deletingTaskId === t.taskid ? 'Deleting...' : 'Delete'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        remainingHours={calculateAvailableTime()}
      />
    </div>
  );
};

export default Tasks;
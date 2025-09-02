import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Clock from './Clock';
import './dashboard.css';

const Tasks = () => {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [error, setError] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoadingTasks(true);
    try {
      const res = await fetch(`http://localhost:3000/tasks?userId=${Number(userId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleAddTask = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not identified. Please log in again.');
      return;
    }
    if (!newTask.trim()) {
      setError('Please enter a task name.');
      return;
    }
    setError('');
    setAdding(true);
    try {
      const taskId = Math.floor(Date.now() / 1000);
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), taskId, task: newTask.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add task');
      }
      setNewTask('');
      fetchTasks();
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

        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <Clock />
          <div className="user-info" style={{ justifyContent: 'flex-end' }}>
            <button onClick={handleBack} className="logout-btn">Back to Dashboard</button>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="welcome-message">
            <div className="task-add-section">
              <h3 className="task-title">Add a task</h3>
              <div className="task-row">
                <input
                  className="task-input"
                  type="text"
                  placeholder="Enter task name"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  disabled={adding}
                />
                <button className="task-button" onClick={handleAddTask} disabled={adding}>
                  {adding ? 'Adding...' : 'Add Task'}
                </button>
              </div>
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
                      <span className="task-name">{t.task}</span>
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
    </div>
  );
};

export default Tasks; 
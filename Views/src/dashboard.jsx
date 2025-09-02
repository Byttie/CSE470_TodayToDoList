import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
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

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    // Redirect to login page
    navigate('/');
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
      // Use epoch seconds to keep within 32-bit integer range
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
      // Optimistic update or refetch
      setTasks((prev) => prev.filter((t) => t.taskid !== taskId));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingTaskId(null);
    }
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

export default Dashboard; 
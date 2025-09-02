import { useState, useEffect } from 'react';
import './AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onAddTask, remainingHours }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    hours: 1,
    minutes: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        priority: 'medium',
        hours: 1,
        minutes: 0
      });
      setError('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Format decimal hours to hours and minutes
  const formatTime = (decimalHours) => {
    if (decimalHours === 0) return "0h 0m";
    
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    } else if (hours === 0) {
      return `${minutes}m`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  // Convert hours and minutes to decimal hours
  const convertToDecimalHours = (hours, minutes) => {
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const total = h + (m / 60);
    // Round to avoid floating point precision issues
    return Math.round(total * 1000) / 1000;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Task name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Task description is required');
      return;
    }
    
    const totalTime = convertToDecimalHours(formData.hours, formData.minutes);
    
    // Add small tolerance for floating point precision issues
    const tolerance = 0.01;
    
    if (totalTime > (remainingHours + tolerance)) {
      setError(`Task time cannot exceed available time (${formatTime(remainingHours)})`);
      return;
    }
    
    if (totalTime <= 0) {
      setError('Task time must be greater than 0');
      return;
    }

    // Convert back to the expected format for the backend
    const taskData = {
      name: formData.name,
      description: formData.description,
      priority: formData.priority,
      time: totalTime
    };

    onAddTask(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="time-info">
            <p>Available time for new tasks: <strong>{formatTime(remainingHours)}</strong></p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Task Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter task name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows="3"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Estimated Time *</label>
              <div className="time-input-group">
                <div className="time-input">
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    min="0"
                    max="23"
                    placeholder="0"
                    required
                  />
                  <label htmlFor="hours">Hours</label>
                </div>
                <div className="time-input">
                  <input
                    type="number"
                    id="minutes"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleInputChange}
                    min="0"
                    max="59"
                    placeholder="0"
                    required
                  />
                  <label htmlFor="minutes">Minutes</label>
                </div>
              </div>
              <small>Maximum: {formatTime(remainingHours)} available</small>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;

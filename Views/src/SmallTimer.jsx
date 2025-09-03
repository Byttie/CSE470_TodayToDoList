import { useState, useEffect, useRef } from 'react';
import './SmallTimer.css';

const SmallTimer = ({ taskId, taskTime, taskName, onTimerComplete, onTaskCompleted, onTaskTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  // Convert task time (in hours) to seconds for countdown
  const initializeTimer = () => {
    const totalSeconds = Math.round(taskTime * 3600); // Convert hours to seconds
    setTimeLeft(totalSeconds);
  };

  useEffect(() => {
    initializeTimer();
  }, [taskTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasStarted(false);
            // Timer completed - this means task timeout
            if (onTaskTimeout) {
              onTaskTimeout(taskId, taskTime, taskName);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, taskName, taskId, taskTime, onTaskTimeout]);

  const startTimer = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handleTaskCompleted = () => {
    if (onTaskCompleted) {
      onTaskCompleted(taskId, taskTime, taskName);
    }
    setIsCompleted(true);
    setIsRunning(false);
    setHasStarted(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getStatus = () => {
    if (isCompleted) return 'completed';
    if (!hasStarted) return 'ready';
    if (isRunning) return 'running';
    if (timeLeft === 0) return 'timeout';
    return 'ready';
  };

  const status = getStatus();

  return (
    <div className={`small-timer ${status}`}>
      <div className="timer-display">
        <span className="timer-time">{formatTime(timeLeft)}</span>
      </div>
      
      <div className="timer-controls">
        {!hasStarted && !isCompleted && (
          <button 
            className="timer-btn start-btn" 
            onClick={startTimer}
            disabled={timeLeft === 0}
            title="Start Timer"
          >
            ▶️
          </button>
        )}
        
        {hasStarted && !isCompleted && (
          <button 
            className="timer-btn complete-btn" 
            onClick={handleTaskCompleted}
            title="Mark Task as Completed"
          >
            ✅
          </button>
        )}
        
        {isCompleted && (
          <div className="completion-message">
            <span className="success-text">Task Completed! 🎉</span>
          </div>
        )}
        
        {status === 'timeout' && (
          <div className="timeout-message">
            <span className="timeout-text">Time's Up! ⏰</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmallTimer;

import { useState, useEffect, useRef } from 'react';
import './SmallTimer.css';

const SmallTimer = ({ taskId, taskTime, taskName, onTimerComplete, onTaskCompleted, onTaskTimeout, autoStart, onStart, showCompletedMessage = true, persistKey }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = Math.round(taskTime * 3600);

  // Convert task time (in hours) to seconds for countdown
  const initializeTimer = () => {
    setTimeLeft(totalSeconds);
  };

  const readPersist = () => {
    if (!persistKey) return null;
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  };

  const writePersist = (data) => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify(data));
    } catch (_) {}
  };

  const clearPersist = () => {
    if (!persistKey) return;
    try { localStorage.removeItem(persistKey); } catch (_) {}
  };

  useEffect(() => {
    initializeTimer();
  }, [totalSeconds]);

  // Restore from persistence on mount
  useEffect(() => {
    const saved = readPersist();
    if (saved && typeof saved.startedAt === 'number' && typeof saved.durationSec === 'number') {
      const now = Date.now();
      const elapsed = Math.floor((now - saved.startedAt) / 1000);
      const remaining = Math.max(0, saved.durationSec - elapsed);
      setTimeLeft(remaining);
      if (remaining > 0) {
        setHasStarted(true);
        setIsRunning(true);
      } else {
        // Timer already finished while away
        clearPersist();
        if (onTaskTimeout) {
          onTaskTimeout(taskId, taskTime, taskName);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-start support (if used elsewhere)
  useEffect(() => {
    if (autoStart && !hasStarted && timeLeft > 0) {
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasStarted(false);
            clearPersist();
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
    writePersist({ startedAt: Date.now(), durationSec: totalSeconds });
    if (onStart) {
      onStart(taskId);
    }
  };

  const handleTaskCompleted = () => {
    if (onTaskCompleted) {
      onTaskCompleted(taskId, taskTime, taskName);
    }
    setIsCompleted(true);
    setIsRunning(false);
    setHasStarted(false);
    clearPersist();
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
        
        {isCompleted && showCompletedMessage && (
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

import { useState, useEffect, useRef } from 'react';
import './SmallTimer.css';

const SmallTimer = ({ taskId, taskTime, taskName, onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
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
            setIsPaused(false);
            setHasStarted(false);
            if (onTimerComplete) {
              onTimerComplete(taskName);
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
  }, [isRunning, timeLeft, taskName, onTimerComplete]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setHasStarted(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setHasStarted(false);
    initializeTimer();
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
    if (!hasStarted) return 'ready';
    if (isRunning) return 'running';
    if (isPaused) return 'paused';
    if (timeLeft === 0) return 'completed';
    return 'ready';
  };

  const status = getStatus();

  return (
    <div className={`small-timer ${status}`}>
      <div className="timer-display">
        <span className="timer-time">{formatTime(timeLeft)}</span>
      </div>
      
      <div className="timer-controls">
        {!hasStarted && (
          <button 
            className="timer-btn start-btn" 
            onClick={startTimer}
            disabled={timeLeft === 0}
            title="Start Timer"
          >
            ▶️
          </button>
        )}
        
        {hasStarted && !isRunning && timeLeft > 0 && (
          <button 
            className="timer-btn start-btn" 
            onClick={startTimer}
            title="Resume Timer"
          >
            ▶️
          </button>
        )}
        
        {isRunning && (
          <button 
            className="timer-btn pause-btn" 
            onClick={pauseTimer}
            title="Pause Timer"
          >
            ⏸️
          </button>
        )}
        
        {hasStarted && (
          <button 
            className="timer-btn reset-btn" 
            onClick={resetTimer}
            title="Reset Timer"
          >
            🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default SmallTimer;

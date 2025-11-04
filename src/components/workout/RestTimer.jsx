import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiX } from 'react-icons/fi';

const RestTimer = ({ duration = 60, onComplete, onSkip, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHW7A7+CURAkUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHW7A7+CURAk='); // Beep sound

    // Start timer
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Play sound when timer completes
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onComplete]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
    } else if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onComplete]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (onSkip) onSkip();
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (onClose) onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Rest Timer</h3>

        {/* Circular Progress Timer */}
        <div className="relative w-56 h-56 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                {isPaused ? 'Paused' : 'Remaining'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Pause/Play Button */}
          <button
            onClick={togglePause}
            className="p-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors"
            disabled={timeLeft === 0}
          >
            {isPaused ? (
              <FiPlay className="w-6 h-6" />
            ) : (
              <FiPause className="w-6 h-6" />
            )}
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Skip Rest</span>
            <FiSkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setTimeLeft(prev => Math.max(0, prev - 10))}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            disabled={timeLeft === 0}
          >
            -10s
          </button>
          <button
            onClick={() => setTimeLeft(prev => prev + 10)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            disabled={timeLeft === 0}
          >
            +10s
          </button>
          <button
            onClick={() => setTimeLeft(prev => prev + 30)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            disabled={timeLeft === 0}
          >
            +30s
          </button>
        </div>

        {/* Timer Complete Message */}
        {timeLeft === 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-800 font-semibold">Rest period complete!</p>
            <p className="text-green-600 text-sm mt-1">Ready for your next set</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestTimer;

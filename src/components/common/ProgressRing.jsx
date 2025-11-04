import { useEffect, useState } from 'react';

const ProgressRing = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = '#7B68EE',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  label = '',
  animate = true
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    if (animate) {
      // Animate from 0 to target percentage
      const duration = 1000; // 1 second
      const steps = 60;
      const increment = percentage / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setAnimatedPercentage(percentage);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animate]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(animatedPercentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-600 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;

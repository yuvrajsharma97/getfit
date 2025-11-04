import React from 'react';

const MetricCard = ({ icon: Icon, value, unit, label, gradient, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${gradient}
        rounded-2xl shadow-lg
        p-4 lg:p-6
        flex flex-col justify-between
        h-40 lg:h-48
        hover:scale-105 lg:hover:shadow-2xl
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        relative overflow-hidden
      `}
    >
      {/* Icon Circle */}
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </div>

      {/* Value and Unit */}
      <div className="flex-1 flex items-center mt-3">
        <span className="text-3xl lg:text-4xl font-bold text-white leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-sm lg:text-base text-white/80 ml-1">
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="text-xs lg:text-sm text-white/80 mt-2">
        {label}
      </div>
    </div>
  );
};

export default React.memo(MetricCard);

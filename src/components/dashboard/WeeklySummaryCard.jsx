import React from 'react';

const WeeklySummaryCard = ({ stats }) => {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-0 mb-6 lg:mb-0 bg-white p-5 lg:p-6 rounded-2xl shadow-md lg:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        This Week
      </h3>

      <div className="space-y-3 lg:space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="text-sm lg:text-lg font-semibold text-gray-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySummaryCard;

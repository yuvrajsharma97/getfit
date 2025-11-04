import React from 'react';
import ProgressRing from '../common/ProgressRing';

const ActiveWorkoutCard = ({ workout, onContinue }) => {
  if (!workout) return null;

  const progressPercentage = (workout.currentDay / workout.totalDays) * 100;

  return (
    <div className="mx-4 sm:mx-6 lg:mx-0 mb-6 lg:mb-0 bg-white p-5 lg:p-6 rounded-2xl shadow-md lg:shadow-lg border border-gray-200 lg:flex lg:justify-between lg:items-center">
      {/* Left Content */}
      <div className="lg:w-3/5">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 font-semibold">
          ACTIVE PROGRAM
        </p>

        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2">
          {workout.name}
        </h3>

        <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4">
          Day {workout.currentDay} of {workout.totalDays}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden mb-4 lg:mb-6">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Button */}
        <button
          onClick={onContinue}
          className="w-full lg:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 lg:px-6 rounded-xl transition-all duration-150 active:scale-98 shadow-sm"
        >
          Continue Workout
        </button>
      </div>

      {/* Right Content - Circular Progress (Desktop only) */}
      <div className="hidden lg:flex lg:w-2/5 justify-center items-center">
        <ProgressRing
          percentage={progressPercentage}
          size={128}
          strokeWidth={10}
          color="#7B68EE"
          showPercentage={true}
          animate={true}
        />
      </div>
    </div>
  );
};

export default ActiveWorkoutCard;

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiActivity, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { workoutTemplates } from '../data/workoutTemplates';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

const WorkoutTemplateDetail = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveWorkout, activateWorkout } = useWorkout();

  const [expandedDays, setExpandedDays] = useState([]);

  // Find the template
  const template = workoutTemplates.find(t => t.id === workoutId);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workout Not Found</h2>
          <button
            onClick={() => navigate('/workouts')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-orange-100 text-orange-700',
    athlete: 'bg-red-100 text-red-700',
  };

  const typeLabels = {
    '3-day-split': '3-Day Split',
    '4-day-split': '4-Day Split',
    '5-day-split': '5-Day Split',
    'full-body': 'Full Body',
  };

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleDay = (dayNumber) => {
    setExpandedDays(prev =>
      prev.includes(dayNumber)
        ? prev.filter(d => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleStartProgram = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const routineId = await saveWorkout(template);
      await activateWorkout(routineId);
      alert(`Successfully started "${template.name}"!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting program:', error);
      alert('Failed to start program. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/workouts')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Workouts
          </button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.name}</h1>
              <p className="text-gray-600 max-w-2xl">{template.description}</p>
            </div>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${difficultyColors[template.difficulty]}`}>
              {capitalizeWords(template.difficulty)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Program Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-semibold text-gray-900">{template.daysPerWeek} days/week</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{template.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Split Type</p>
                <p className="font-semibold text-gray-900">{typeLabels[template.type]}</p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Goals</h3>
            <div className="flex flex-wrap gap-2">
              {template.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {template.equipment && template.equipment.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {template.equipment.map((equipment, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg"
                  >
                    {capitalizeWords(equipment)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Workout Days */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Workout Schedule</h2>

          <div className="space-y-4">
            {template.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.dayNumber)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold">
                      {day.dayNumber}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">{day.name}</h3>
                      <p className="text-sm text-gray-600">{day.exercises.length} exercises</p>
                    </div>
                  </div>
                  {expandedDays.includes(day.dayNumber) ? (
                    <FiChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Day Exercises */}
                {expandedDays.includes(day.dayNumber) && (
                  <div className="border-t border-gray-200">
                    <div className="p-6 space-y-4">
                      {day.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 capitalize mb-1">
                              {exercise.exerciseName}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>
                                <span className="font-medium">Sets:</span> {exercise.sets}
                              </span>
                              <span>
                                <span className="font-medium">Reps:</span> {exercise.reps}
                              </span>
                              <span>
                                <span className="font-medium">Rest:</span> {exercise.restTime}s
                              </span>
                            </div>
                            {exercise.notes && (
                              <p className="mt-2 text-sm text-gray-600 italic">
                                Note: {exercise.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartProgram}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start This Program
            </button>
            <button
              onClick={() => alert('Customize feature coming soon!')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Customize & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTemplateDetail;

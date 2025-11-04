import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMetrics } from '../context/MetricsContext';
import { useWorkout } from '../context/WorkoutContext';
import { useToast } from '../context/ToastContext';
import { formatValue, formatNumber } from '../utils/formatters';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { metrics, stats, isLoading, saveActivity, calculatePercentage, lastUpdated } = useMetrics();
  const { activeWorkout } = useWorkout();
  const toast = useToast();
  const userName = user?.displayName?.split(' ')[0] || 'User';

  // Check if data is from today
  const isDataFromToday = lastUpdated &&
    new Date(lastUpdated).toDateString() === new Date().toDateString();

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'GOOD MORNING';
    if (hour >= 12 && hour < 17) return 'GOOD AFTERNOON';
    if (hour >= 17 && hour < 22) return 'GOOD EVENING';
    return 'GOOD NIGHT';
  };

  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    steps: '',
    calories: '',
    water: '',
    sleep: ''
  });
  const [isSaving, setIsSaving] = useState(false);


  // Handle modal open/close
  const openModal = (modalType) => {
    setActiveModal(modalType);
    // Pre-fill with current values (or empty if null)
    setFormData({
      steps: metrics.steps ?? '',
      calories: metrics.calories ?? '',
      water: metrics.water ?? '',
      sleep: metrics.sleep ?? ''
    });
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({ steps: '', calories: '', water: '', sleep: '' });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save activity data using context
  const saveActivityData = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Get the value for the current field being edited
      let value = null;
      if (activeModal === 'steps') value = formData.steps;
      if (activeModal === 'calories') value = formData.calories;
      if (activeModal === 'water') value = formData.water;
      if (activeModal === 'sleep') value = formData.sleep;

      // Save using context function
      const result = await saveActivity(activeModal, value);

      if (result.success) {
        closeModal();
        toast.success('Activity saved successfully!');
      } else {
        toast.error(`Failed to save activity: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ HEADER SECTION ============ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Top bar - Mobile */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {getGreeting()}, <br />{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {userName.toUpperCase()}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 border-2 border-indigo-600 rounded-lg hover:bg-indigo-600 hover:border-indigo-700 transition-all group"
              aria-label="Logout">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ========== WEEKLY SUMMARY SECTION ========== */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            This Week
          </h2>

          {/* Grid - 2 col mobile, 4 col desktop */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Workouts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatValue(stats.thisWeek.workouts)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {activeWorkout?.daysPerWeek || metrics.workoutsGoal}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatValue(stats.thisWeek.totalTime)}
                </p>
                <p className="text-xs text-gray-500 mt-1">this week</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Calories</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatValue(stats.thisWeek.calories)}
                </p>
                <p className="text-xs text-gray-500 mt-1">burned</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Weight</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatValue(stats.thisWeek.weight, 'kg')}
                </p>
                <p className="text-xs text-gray-500 mt-1">current</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========== TODAY'S ACTIVITY SECTION ========== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Today's Activity
            </h2>
            {!isDataFromToday && lastUpdated && (
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                Showing data from {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Horizontal grid of metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* METRIC CARD 1 - Steps */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚶</span>
                  <span className="text-xs font-medium text-gray-600">
                    Steps
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {calculatePercentage(metrics.steps, metrics.stepsGoal)}%
                </span>
              </div>

              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.steps)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {metrics.stepsGoal.toLocaleString()}
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${calculatePercentage(
                      metrics.steps,
                      metrics.stepsGoal
                    )}%`,
                  }}></div>
              </div>
            </div>

            {/* METRIC CARD 2 - Calories */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="text-xs font-medium text-gray-600">
                    Calories
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {calculatePercentage(metrics.calories, metrics.caloriesGoal)}%
                </span>
              </div>

              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metrics.calories)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {metrics.caloriesGoal} kcal
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${calculatePercentage(
                      metrics.calories,
                      metrics.caloriesGoal
                    )}%`,
                  }}></div>
              </div>
            </div>

            {/* METRIC CARD 3 - Water */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💧</span>
                  <span className="text-xs font-medium text-gray-600">
                    Water
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {calculatePercentage(metrics.water, metrics.waterGoal)}%
                </span>
              </div>

              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metrics.water)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {metrics.waterGoal} glasses
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${calculatePercentage(
                      metrics.water,
                      metrics.waterGoal
                    )}%`,
                  }}></div>
              </div>
            </div>

            {/* METRIC CARD 4 - Sleep */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">😴</span>
                  <span className="text-xs font-medium text-gray-600">
                    Sleep
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {calculatePercentage(metrics.sleep, metrics.sleepGoal)}%
                </span>
              </div>

              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metrics.sleep, 'h')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {metrics.sleepGoal}h goal
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${calculatePercentage(
                      metrics.sleep,
                      metrics.sleepGoal
                    )}%`,
                  }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== ACTIVE PROGRAM SECTION ========== */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            {activeWorkout ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                      Active Program
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {activeWorkout.name || 'My Workout Program'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeWorkout.currentDay ? `Day ${activeWorkout.currentDay} of ${activeWorkout.totalDays || activeWorkout.daysPerWeek}` : `${activeWorkout.daysPerWeek} days per week`}
                      {activeWorkout.difficulty && ` • ${activeWorkout.difficulty.charAt(0).toUpperCase() + activeWorkout.difficulty.slice(1)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {activeWorkout.currentDay && activeWorkout.totalDays
                        ? Math.round((activeWorkout.currentDay / activeWorkout.totalDays) * 100)
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Complete</div>
                  </div>
                </div>

                {/* Progress bar - larger */}
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-6">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${activeWorkout.currentDay && activeWorkout.totalDays
                        ? Math.round((activeWorkout.currentDay / activeWorkout.totalDays) * 100)
                        : 0}%`
                    }}></div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate('/active-workout')}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                  Continue Workout
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Program</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Start a workout program to track your progress
                </p>
                <button
                  onClick={() => navigate('/workouts')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                  Browse Workout Programs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========== QUICK ACTIONS ========== */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => openModal('steps')}
              className="bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-4 text-center transition-all group">
              <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🚶</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Log Steps</p>
            </button>

            <button
              onClick={() => openModal('calories')}
              className="bg-white border border-gray-200 hover:border-emerald-300 rounded-xl p-4 text-center transition-all group">
              <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Log Calories</p>
            </button>

            <button
              onClick={() => openModal('water')}
              className="bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-all group">
              <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">💧</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Log Water</p>
            </button>

            <button
              onClick={() => openModal('sleep')}
              className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-4 text-center transition-all group">
              <div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">😴</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Log Sleep</p>
            </button>
          </div>
        </div>
      </div>

      {/* ============ MODAL ============ */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {activeModal === 'steps' && 'Log Steps'}
                {activeModal === 'calories' && 'Log Calories'}
                {activeModal === 'water' && 'Log Water'}
                {activeModal === 'sleep' && 'Log Sleep'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              {activeModal === 'steps' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Steps
                  </label>
                  <input
                    type="number"
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    placeholder="Enter steps (e.g., 8547)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Goal: {metrics.stepsGoal.toLocaleString()} steps</p>
                </div>
              )}

              {activeModal === 'calories' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    placeholder="Enter calories (e.g., 420)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Goal: {metrics.caloriesGoal} kcal</p>
                </div>
              )}

              {activeModal === 'water' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Intake (glasses)
                  </label>
                  <input
                    type="number"
                    value={formData.water}
                    onChange={(e) => handleInputChange('water', e.target.value)}
                    placeholder="Enter glasses (e.g., 6)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Goal: {metrics.waterGoal} glasses</p>
                </div>
              )}

              {activeModal === 'sleep' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Duration (hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.sleep}
                    onChange={(e) => handleInputChange('sleep', e.target.value)}
                    placeholder="Enter hours (e.g., 7.5)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Goal: {metrics.sleepGoal}h</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={saveActivityData}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

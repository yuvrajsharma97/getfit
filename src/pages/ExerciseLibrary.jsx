import { useState } from 'react';
import { useExercise } from '../context/ExerciseContext';
import ExerciseSearch from '../components/exercises/ExerciseSearch';
import ExerciseFilters from '../components/exercises/ExerciseFilters';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal';
import { FiFilter, FiSearch } from 'react-icons/fi';

const ExerciseLibrary = () => {
  const { exercises, loading, error, searchExercises, searchQuery, hasActiveFilters, activeFilterCount } = useExercise();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  const handleAddToWorkout = (exercise) => {
    console.log('Add to workout:', exercise);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercise Library</h1>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1">
              <ExerciseSearch
                value={searchQuery}
                onChange={searchExercises}
                placeholder="Search by exercise name..."
              />
            </div>
            <ExerciseFilters />
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Active filters:</span>
              <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full font-medium text-xs">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading exercises...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="bg-error-50 border border-error-200 rounded-2xl p-8">
              <div className="w-14 h-14 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-error-900 mb-2">Error Loading Exercises</h3>
              <p className="text-error-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && exercises.length === 0 && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Exercise Grid */}
        {!loading && !error && exercises.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {hasActiveFilters ? 'Filtered Results' : 'All Exercises'}
              </h2>
              <p className="text-sm text-gray-600">
                {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToWorkout={handleAddToWorkout}
      />
    </div>
  );
};

export default ExerciseLibrary;

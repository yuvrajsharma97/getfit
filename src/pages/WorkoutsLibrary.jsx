import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { workoutTemplates } from '../data/workoutTemplates';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutTemplateCard from '../components/workout/WorkoutTemplateCard';
import { useAuth } from '../context/AuthContext';

const WorkoutsLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workouts, saveWorkout, activateWorkout } = useWorkout();

  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return workoutTemplates.filter(template => {
      const matchesType = selectedType === 'all' || template.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      return matchesType && matchesDifficulty;
    });
  }, [selectedType, selectedDifficulty]);

  const handleStartProgram = (template) => {
    // Navigate to detail page to show program details before opting in
    navigate(`/workouts/${template.id}`);
  };

  // Split type options
  const splitTypes = [
    { value: 'all', label: 'All Programs' },
    { value: '3-day-split', label: '3-Day Split' },
    { value: '4-day-split', label: '4-Day Split' },
    { value: '5-day-split', label: '5-Day Split' },
    { value: 'full-body', label: 'Full Body' },
  ];

  // Difficulty options
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'athlete', label: 'Athlete' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 overflow-hidden mb-8">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-14 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                Workout Programs
              </h1>
              <p className="text-sm text-white/90">
                Choose a program that fits your goals
              </p>
            </div>

            {/* Search Icon */}
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <FiSearch className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Pills Section - Sticky */}
      <div className="sticky top-0 z-30 bg-gray-50 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Split Type Filters */}
          <div className="mb-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {splitTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedType === type.value
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedDifficulty === diff.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredTemplates.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {selectedType === 'all' && selectedDifficulty === 'all'
                  ? 'All Programs'
                  : 'Filtered Programs'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredTemplates.length} program{filteredTemplates.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <WorkoutTemplateCard
                  key={template.id}
                  template={template}
                  onStartProgram={handleStartProgram}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {user && (
        <button
          onClick={() => navigate('/workouts/create')}
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 group"
        >
          <div className="flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
            <FiPlus className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">Create Custom</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default WorkoutsLibrary;

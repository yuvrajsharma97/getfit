import { useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

const ExerciseDetailModal = ({ exercise, isOpen, onClose, onAddToWorkout }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!isOpen || !exercise) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {capitalizeWords(exercise.name)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Exercise GIF */}
          <div className="mb-6 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Exercise Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Body Part */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Body Part</h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  {capitalizeWords(exercise.bodyPart)}
                </span>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Equipment</h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {capitalizeWords(exercise.equipment)}
                </span>
              </div>
            </div>

            {/* Target Muscle */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Primary Target</h3>
              <p className="text-lg font-semibold text-gray-900">
                {capitalizeWords(exercise.target)}
              </p>
            </div>

            {/* Secondary Muscles */}
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Secondary Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                    >
                      {capitalizeWords(muscle)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How to Perform</h3>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-0.5">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Action Button */}
          {onAddToWorkout && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onAddToWorkout(exercise);
                  onClose();
                }}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Add to Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;

import { useState } from 'react';
import { GiWeightLiftingUp, GiMuscleUp } from 'react-icons/gi';

const ExerciseCard = ({ exercise, onViewDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Equipment icon mapping
  const getEquipmentIcon = (equipment) => {
    if (equipment.includes('barbell') || equipment.includes('dumbbell') || equipment.includes('weight')) {
      return <GiWeightLiftingUp className="w-4 h-4" />;
    }
    return <GiMuscleUp className="w-4 h-4" />;
  };

  // Body part color mapping
  const getBodyPartColor = (bodyPart) => {
    const colors = {
      chest: 'bg-primary-600/80',
      back: 'bg-cyan-500/80',
      legs: 'bg-success-500/80',
      shoulders: 'bg-warning-500/80',
      arms: 'bg-coral-500/80',
      core: 'bg-navy-600/80',
      cardio: 'bg-primary-400/80',
    };

    for (const [key, value] of Object.entries(colors)) {
      if (bodyPart.toLowerCase().includes(key)) {
        return value;
      }
    }
    return 'bg-primary-600/80';
  };

  return (
    <div
      onClick={() => onViewDetails(exercise)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shadow-md"
    >
      {/* Exercise GIF Container */}
      <div className="relative aspect-square bg-gray-200 overflow-hidden">
        {!imageError ? (
          <>
            {/* Loading State */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Exercise GIF */}
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Body Part Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`${getBodyPartColor(exercise.bodyPart)} backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {capitalizeWords(exercise.bodyPart)}
          </div>
        </div>

        {/* Equipment Icon Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg shadow-lg">
            {getEquipmentIcon(exercise.equipment)}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Exercise Name */}
        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
          {capitalizeWords(exercise.name)}
        </h3>

        {/* Target Muscle */}
        <p className="text-sm text-gray-600 mb-3 truncate">
          Target: <span className="font-medium text-gray-900">{capitalizeWords(exercise.target)}</span>
        </p>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(exercise);
          }}
          className="w-full h-10 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-150"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;

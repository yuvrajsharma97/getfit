import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';

const WorkoutTemplateCard = ({ template, onStartProgram }) => {
  const navigate = useNavigate();

  // Gradient configurations for different difficulty levels
  const gradientConfigs = {
    beginner: {
      gradient: 'bg-gradient-to-br from-purple-400 to-purple-300',
      badge: 'bg-white/20 backdrop-blur-sm',
    },
    intermediate: {
      gradient: 'bg-gradient-to-br from-primary-600 to-blue-500',
      badge: 'bg-white/20 backdrop-blur-sm',
    },
    advanced: {
      gradient: 'bg-gradient-to-br from-primary-700 via-primary-600 to-navy-600',
      badge: 'bg-white/20 backdrop-blur-sm',
    },
    athlete: {
      gradient: 'bg-gradient-to-br from-primary-600 to-coral-500',
      badge: 'bg-white/20 backdrop-blur-sm',
    },
  };

  const config = gradientConfigs[template.difficulty];

  const handleViewDetails = () => {
    navigate(`/workouts/${template.id}`);
  };

  const handleStartProgram = (e) => {
    e.stopPropagation();
    if (onStartProgram) {
      onStartProgram(template);
    }
  };

  // Calculate total exercises
  const totalExercises = template.days.reduce((sum, day) => sum + day.exercises.length, 0);

  return (
    <div
      onClick={handleViewDetails}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-lg"
    >
      {/* Gradient Header with Illustration */}
      <div className={`relative h-44 ${config.gradient} overflow-hidden`}>
        {/* Abstract Workout Illustration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <GiWeightLiftingUp className="w-32 h-32 text-white transform rotate-12" />
        </div>

        {/* Subtle Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`${config.badge} text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}>
            {template.difficulty}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Workout Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-1 mb-3 text-xs text-gray-700 flex-wrap">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-primary-600" />
            <span className="font-medium">{template.daysPerWeek} days/week</span>
          </div>
          <span className="text-gray-300 mx-0.5">•</span>
          <div className="flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-primary-600" />
            <span className="font-medium">{template.duration}</span>
          </div>
          <span className="text-gray-300 mx-0.5">•</span>
          <div className="flex items-center gap-1.5">
            <FiTrendingUp className="w-3.5 h-3.5 text-primary-600" />
            <span className="font-medium">{totalExercises} exercises</span>
          </div>
        </div>

        {/* Equipment Tags */}
        {template.equipment && template.equipment.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {template.equipment.slice(0, 2).map((equipment, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap"
              >
                {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
              </span>
            ))}
            {template.equipment.length > 2 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium whitespace-nowrap">
                +{template.equipment.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleStartProgram}
          className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all duration-150 active:scale-98 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Start Program
        </button>
      </div>
    </div>
  );
};

export default WorkoutTemplateCard;

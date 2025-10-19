const SelectionCard = ({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full p-6 rounded-xl border-2 transition-all duration-250 text-left
        ${
          selected
            ? 'border-primary-600 bg-primary-50 shadow-md scale-[1.02]'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-card'
        }
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        active:scale-[0.98]
        ${className}
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center animate-scale-in">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        {Icon && (
          <div
            className={`
            flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors
            ${
              selected
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-100 text-gray-600'
            }
          `}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 pt-1">
          <h3
            className={`font-semibold mb-1 transition-colors ${
              selected ? 'text-primary-900' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default SelectionCard;

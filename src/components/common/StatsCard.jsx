const StatsCard = ({
  icon: Icon,
  value,
  label,
  unit = '',
  subtext = '',
  gradient = false,
  gradientFrom = 'primary-600',
  gradientTo = 'primary-400',
  chart = null,
  trend = null,
  onClick = null
}) => {
  const gradientClass = gradient
    ? `bg-gradient-to-br from-${gradientFrom} to-${gradientTo} text-white`
    : 'bg-white text-gray-900';

  return (
    <div
      onClick={onClick}
      className={`${gradientClass} rounded-2xl shadow-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`${gradient ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary-100'} p-3 rounded-full`}>
          <Icon className={`w-6 h-6 ${gradient ? 'text-white' : 'text-primary-600'}`} />
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${gradient ? 'text-white/90' : trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-4xl font-bold">
          {value}
        </span>
        {unit && (
          <span className={`text-lg font-medium ml-1 ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div className={`text-xs uppercase tracking-wide font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
        {label}
      </div>

      {/* Subtext (optional) */}
      {subtext && (
        <div className={`text-xs mt-1 ${gradient ? 'text-white/60' : 'text-gray-500'}`}>
          {subtext}
        </div>
      )}

      {/* Chart (optional) */}
      {chart && (
        <div className="mt-4">
          {chart}
        </div>
      )}
    </div>
  );
};

export default StatsCard;

import { useMemo } from 'react';

const WeightProgressChart = ({ data, detailed = false }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const weights = data.map(d => d.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight;
    const padding = range * 0.1 || 5;

    return {
      data,
      minWeight: minWeight - padding,
      maxWeight: maxWeight + padding,
      range: maxWeight - minWeight,
      latestWeight: weights[weights.length - 1],
      startWeight: weights[0],
      change: weights[weights.length - 1] - weights[0],
    };
  }, [data]);

  if (!chartData || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No weight data available
      </div>
    );
  }

  const { minWeight, maxWeight, latestWeight, startWeight, change } = chartData;
  const chartHeight = detailed ? 300 : 200;
  const chartWidth = 600;

  // Calculate points for the line chart
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.weight - minWeight) / (maxWeight - minWeight)) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Start</p>
          <p className="text-xl font-bold text-gray-900">{startWeight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Current</p>
          <p className="text-xl font-bold text-indigo-600">{latestWeight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Change</p>
          <p className={`text-xl font-bold ${change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          style={{ minHeight: chartHeight }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
            const y = chartHeight - percent * chartHeight;
            const weight = (minWeight + (maxWeight - minWeight) * percent).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="-5"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  fontSize="10"
                >
                  {weight}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          <path
            d={`${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#4F46E5"
                strokeWidth="2"
              />
              {detailed && (
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                  fontSize="10"
                >
                  {point.weight}
                </text>
              )}
            </g>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Date labels */}
      {detailed && data.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{new Date(data[0].date).toLocaleDateString()}</span>
          <span>{new Date(data[data.length - 1].date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default WeightProgressChart;

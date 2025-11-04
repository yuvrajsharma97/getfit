import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useExercise } from '../../context/ExerciseContext';

const ExerciseFilters = () => {
  const {
    selectedBodyPart,
    selectedEquipment,
    bodyParts,
    equipmentTypes,
    filterByBodyPart,
    filterByEquipment,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useExercise();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleBodyPartChange = (e) => {
    filterByBodyPart(e.target.value);
  };

  const handleEquipmentChange = (e) => {
    filterByEquipment(e.target.value);
  };

  const handleClearFilters = () => {
    clearFilters();
    setIsMobileFiltersOpen(false);
  };

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiFilter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Body Part Filter */}
        <div className="relative">
          <select
            value={selectedBodyPart}
            onChange={handleBodyPartChange}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {bodyParts.map((part) => (
              <option key={part} value={part}>
                {part === 'all' ? 'All Body Parts' : capitalizeWords(part)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Equipment Filter */}
        <div className="relative">
          <select
            value={selectedEquipment}
            onChange={handleEquipmentChange}
            className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {equipmentTypes.map((equipment) => (
              <option key={equipment} value={equipment}>
                {equipment === 'all' ? 'All Equipment' : capitalizeWords(equipment)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiX className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Body Part Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Part
              </label>
              <select
                value={selectedBodyPart}
                onChange={handleBodyPartChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bodyParts.map((part) => (
                  <option key={part} value={part}>
                    {part === 'all' ? 'All Body Parts' : capitalizeWords(part)}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment
              </label>
              <select
                value={selectedEquipment}
                onChange={handleEquipmentChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {equipmentTypes.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment === 'all' ? 'All Equipment' : capitalizeWords(equipment)}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseFilters;

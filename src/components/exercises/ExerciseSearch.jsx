import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const ExerciseSearch = ({ value, onChange, placeholder = 'Search exercises...' }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onChange) {
        onChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onChange]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value || '');
    }
  }, [value]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="w-5 h-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ExerciseSearch;

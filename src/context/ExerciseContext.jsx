import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCachedExercises, searchCachedExercises, getExercisesByBodyPart, getExercisesByEquipment } from '../services/firestore';
import { getBodyParts, getEquipmentTypes } from '../services/exerciseDB';

const ExerciseContext = createContext();

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  // Available filter options
  const bodyParts = ['all', ...getBodyParts()];
  const equipmentTypes = ['all', ...getEquipmentTypes()];

  /**
   * Load all exercises from Firestore cache on mount
   */
  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedExercises = await getCachedExercises();

      if (cachedExercises.length === 0) {
        setError('No exercises found. Please seed the exercise database.');
        setExercises([]);
        setFilteredExercises([]);
      } else {
        setExercises(cachedExercises);
        setFilteredExercises(cachedExercises);
      }
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError('Failed to load exercises. Please try again.');
      setExercises([]);
      setFilteredExercises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply all active filters
   */
  const applyFilters = useCallback(async () => {
    try {
      setLoading(true);
      let result = exercises;

      // Apply body part filter
      if (selectedBodyPart !== 'all') {
        result = await getExercisesByBodyPart(selectedBodyPart);
      }

      // Apply equipment filter
      if (selectedEquipment !== 'all') {
        const equipmentFiltered = await getExercisesByEquipment(selectedEquipment);

        // If both filters are active, find intersection
        if (selectedBodyPart !== 'all') {
          const bodyPartIds = new Set(result.map(ex => ex.id));
          result = equipmentFiltered.filter(ex => bodyPartIds.has(ex.id));
        } else {
          result = equipmentFiltered;
        }
      }

      // Apply search query
      if (searchQuery.trim()) {
        result = result.filter(exercise =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
      }

      setFilteredExercises(result);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }, [exercises, selectedBodyPart, selectedEquipment, searchQuery]);

  /**
   * Search exercises by name
   */
  const searchExercises = useCallback(async (query) => {
    setSearchQuery(query);
  }, []);

  /**
   * Filter by body part
   */
  const filterByBodyPart = useCallback((bodyPart) => {
    setSelectedBodyPart(bodyPart);
  }, []);

  /**
   * Filter by equipment
   */
  const filterByEquipment = useCallback((equipment) => {
    setSelectedEquipment(equipment);
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBodyPart('all');
    setSelectedEquipment('all');
    setFilteredExercises(exercises);
  }, [exercises]);

  /**
   * Get exercise by ID
   */
  const getExerciseById = useCallback((id) => {
    return exercises.find(exercise => exercise.id === id);
  }, [exercises]);

  /**
   * Refresh exercises from cache
   */
  const refreshExercises = useCallback(async () => {
    await loadExercises();
  }, [loadExercises]);

  // Load exercises on mount
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (exercises.length > 0) {
      applyFilters();
    }
  }, [searchQuery, selectedBodyPart, selectedEquipment, exercises, applyFilters]);

  const value = {
    // State
    exercises: filteredExercises,
    allExercises: exercises,
    loading,
    error,

    // Filter state
    searchQuery,
    selectedBodyPart,
    selectedEquipment,

    // Filter options
    bodyParts,
    equipmentTypes,

    // Actions
    searchExercises,
    filterByBodyPart,
    filterByEquipment,
    clearFilters,
    getExerciseById,
    refreshExercises,

    // Computed
    hasActiveFilters: searchQuery !== '' || selectedBodyPart !== 'all' || selectedEquipment !== 'all',
    activeFilterCount: (searchQuery !== '' ? 1 : 0) +
                        (selectedBodyPart !== 'all' ? 1 : 0) +
                        (selectedEquipment !== 'all' ? 1 : 0),
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;

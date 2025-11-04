/**
 * Utility functions for formatting data display across the app
 */

/**
 * Format any value for display - shows "N/A" if data is missing
 * Use this function EVERYWHERE in the app when displaying data from the database
 *
 * @param {any} value - The value to format
 * @param {string} suffix - Optional suffix to append (e.g., "kg", "km", "%")
 * @param {number} decimals - Optional number of decimal places for numbers
 * @returns {string} Formatted value or "N/A"
 *
 * @example
 * formatValue(null) // Returns "N/A"
 * formatValue(undefined) // Returns "N/A"
 * formatValue(70, "kg") // Returns "70 kg"
 * formatValue(7.5, "h") // Returns "7.5 h"
 * formatValue(85.333, "%", 1) // Returns "85.3%"
 */
export const formatValue = (value, suffix = '', decimals = null) => {
  // Check for null, undefined, empty string, or NaN
  if (value === null || value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) {
    return 'N/A';
  }

  // Format number with decimals if specified
  let formattedValue = value;
  if (typeof value === 'number' && decimals !== null) {
    formattedValue = value.toFixed(decimals);
  }

  // Add suffix if provided
  if (suffix) {
    return `${formattedValue} ${suffix}`;
  }

  return String(formattedValue);
};

/**
 * Format number value with thousand separators
 * Shows "N/A" if data is missing
 *
 * @param {number} value - The number to format
 * @param {string} suffix - Optional suffix
 * @returns {string} Formatted number or "N/A"
 *
 * @example
 * formatNumber(8547, "steps") // Returns "8,547 steps"
 * formatNumber(null) // Returns "N/A"
 */
export const formatNumber = (value, suffix = '') => {
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
    return 'N/A';
  }

  const formatted = Number(value).toLocaleString();
  return suffix ? `${formatted} ${suffix}` : formatted;
};

/**
 * Format percentage value
 * Shows "N/A" if data is missing
 *
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted percentage or "N/A"
 *
 * @example
 * formatPercentage(8547, 10000) // Returns "85%"
 * formatPercentage(null, 10000) // Returns "N/A"
 */
export const formatPercentage = (current, goal, decimals = 0) => {
  if (current === null || current === undefined || goal === null || goal === undefined || goal === 0) {
    return 'N/A';
  }

  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  return decimals > 0 ? `${percentage.toFixed(decimals)}%` : `${percentage}%`;
};

/**
 * Calculate percentage for progress bars (returns number, not string)
 * Returns 0 if data is missing
 *
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @returns {number} Percentage (0-100) or 0 if missing
 */
export const calculatePercentage = (current, goal) => {
  if (current === null || current === undefined || goal === null || goal === undefined || goal === 0) {
    return 0;
  }
  return Math.min(Math.round((current / goal) * 100), 100);
};

/**
 * Format weight value
 * Shows "N/A" if data is missing
 *
 * @param {number} weight - Weight in kg
 * @param {string} unit - Unit (default: "kg")
 * @returns {string} Formatted weight or "N/A"
 */
export const formatWeight = (weight, unit = 'kg') => {
  return formatValue(weight, unit, 1);
};

/**
 * Format time duration
 * Shows "N/A" if data is missing
 *
 * @param {string|number} time - Time value (e.g., "3h 12m" or hours as number)
 * @returns {string} Formatted time or "N/A"
 */
export const formatTime = (time) => {
  if (time === null || time === undefined || time === '') {
    return 'N/A';
  }
  return String(time);
};

/**
 * Format date
 * Shows "N/A" if data is missing
 *
 * @param {Date|string} date - Date object or ISO string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or "N/A"
 */
export const formatDate = (date, options = { weekday: 'long', month: 'long', day: 'numeric' }) => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'N/A';
  }
};

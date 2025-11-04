# Utility Functions - Data Formatting

## Overview

**IMPORTANT**: From now on, whenever you display ANY data from the database anywhere in the app, you MUST use the formatting functions from `utils/formatters.js`. This ensures that missing or unavailable data consistently displays as **"N/A"** instead of showing null, undefined, or breaking the UI.

## Import the Functions

```javascript
import { formatValue, formatNumber, calculatePercentage, formatWeight, formatTime } from '../utils/formatters';
```

## Usage Examples

### 1. Basic Value Formatting (Most Common)

Use `formatValue()` for ANY data that might be null/undefined:

```javascript
// Simple value
{formatValue(user.age)}  // Shows "N/A" if age is null

// With unit suffix
{formatValue(metrics.water, 'glasses')}  // "6 glasses" or "N/A"
{formatValue(metrics.sleep, 'h')}  // "7.5 h" or "N/A"
{formatValue(metrics.weight, 'kg')}  // "70 kg" or "N/A"

// With decimal places
{formatValue(bmi, '', 1)}  // "24.5" or "N/A" (1 decimal)
{formatValue(progress, '%', 2)}  // "85.33%" or "N/A" (2 decimals)
```

### 2. Number Formatting (With Thousand Separators)

Use `formatNumber()` for large numbers:

```javascript
{formatNumber(metrics.steps)}  // "8,547" or "N/A"
{formatNumber(calories, 'kcal')}  // "1,240 kcal" or "N/A"
{formatNumber(distance, 'km')}  // "12,345 km" or "N/A"
```

### 3. Percentage Calculation for Progress Bars

Use `calculatePercentage()` for progress bar widths:

```javascript
// Returns 0 if data is missing (safe for width calculations)
const progressWidth = calculatePercentage(current, goal);

<div style={{ width: `${progressWidth}%` }} />
```

### 4. Weight Formatting

```javascript
{formatWeight(user.weight)}  // "70.0 kg" or "N/A"
{formatWeight(user.weight, 'lbs')}  // "154.3 lbs" or "N/A"
```

### 5. Time Formatting

```javascript
{formatTime(workout.duration)}  // "3h 12m" or "N/A"
{formatTime(stats.totalTime)}  // "45:30" or "N/A"
```

## Complete Dashboard Example

```javascript
import { formatValue, formatNumber, calculatePercentage } from '../utils/formatters';

function Dashboard() {
  // ... fetch data from Firestore

  return (
    <div>
      {/* Steps Card */}
      <div>
        <h3>{formatNumber(metrics.steps)}</h3>  {/* "8,547" or "N/A" */}
        <p>of {metrics.stepsGoal.toLocaleString()}</p>
        <ProgressBar width={calculatePercentage(metrics.steps, metrics.stepsGoal)} />
        <span>{calculatePercentage(metrics.steps, metrics.stepsGoal)}%</span>
      </div>

      {/* Water Card */}
      <div>
        <h3>{formatValue(metrics.water, 'glasses')}</h3>  {/* "6 glasses" or "N/A" */}
        <ProgressBar width={calculatePercentage(metrics.water, metrics.waterGoal)} />
      </div>

      {/* Sleep Card */}
      <div>
        <h3>{formatValue(metrics.sleep, 'h')}</h3>  {/* "7.5 h" or "N/A" */}
      </div>

      {/* Weight Display */}
      <div>
        <h3>{formatValue(stats.weight, 'kg')}</h3>  {/* "70 kg" or "N/A" */}
      </div>
    </div>
  );
}
```

## When to Use Each Function

| Function | Use Case | Returns |
|----------|----------|---------|
| `formatValue()` | General purpose - any data | "N/A" or value with optional suffix |
| `formatNumber()` | Large numbers needing commas | "N/A" or formatted number |
| `calculatePercentage()` | Progress bar widths | 0 or percentage (0-100) |
| `formatWeight()` | Weight values | "N/A" or weight with 1 decimal |
| `formatTime()` | Time/duration strings | "N/A" or time string |

## Rules to Follow

✅ **ALWAYS use these functions** when displaying database data
✅ **NEVER directly render** `{someValue}` if it could be null
✅ **USE** `formatValue(someValue)` instead
✅ **FOR NUMBERS**, prefer `formatNumber()` for better readability
✅ **FOR PERCENTAGES**, use `calculatePercentage()` for bars, display with `%`

❌ **DON'T** write inline null checks like `{value ?? 'N/A'}`
❌ **DON'T** use `{value || 'N/A'}` (fails for 0)
❌ **DON'T** forget to handle null/undefined data

## Benefits

1. **Consistency** - All "N/A" displays are uniform across the app
2. **Safety** - No more "null" or "undefined" showing on screen
3. **Maintainability** - One place to update if we change the "N/A" logic
4. **Clean Code** - No repetitive null checks everywhere
5. **User Experience** - Professional handling of missing data

## Adding New Formatters

If you need a new formatter (e.g., for dates, currency, etc.), add it to `utils/formatters.js` following the same pattern:

```javascript
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value);
};
```

---

**Remember**: Consistent use of these formatters throughout the app ensures a polished, professional user experience even when data is missing!

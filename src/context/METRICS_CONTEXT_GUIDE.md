# MetricsContext Usage Guide

## Overview

The `MetricsContext` provides centralized state management for all fitness activity metrics across the app. It handles real-time data fetching from Firestore and makes all metrics available to any component that needs them.

## Why Use MetricsContext?

✅ **Single source of truth** - All metrics data comes from one place
✅ **Real-time updates** - Firestore listener keeps data in sync automatically
✅ **No duplicate fetching** - Data is fetched once and shared across components
✅ **Easy to use** - Simple hook interface: `useMetrics()`
✅ **Available everywhere** - Dashboard, Progress page, Profile, etc. can all access the same data

## How to Use

### 1. Import the Hook

```javascript
import { useMetrics } from '../context/MetricsContext';
```

### 2. Access Metrics in Your Component

```javascript
function ProgressPage() {
  const { metrics, stats, isLoading, saveActivity, calculatePercentage } = useMetrics();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Steps: {metrics.steps}</h1>
      <h1>Calories: {metrics.calories}</h1>
      <h1>Weekly Workouts: {stats.thisWeek.workouts}</h1>
    </div>
  );
}
```

## Available Data

### `metrics` Object

Contains today's activity metrics:

```javascript
{
  steps: 8547,              // Current steps (null if not logged)
  stepsGoal: 10000,         // Daily step goal
  calories: 420,            // Calories burned (null if not logged)
  caloriesGoal: 500,        // Daily calorie goal
  water: 6,                 // Glasses of water (null if not logged)
  waterGoal: 8,             // Daily water goal
  sleep: 7.5,               // Hours of sleep (null if not logged)
  sleepGoal: 8,             // Daily sleep goal
  weight: 70,               // Current weight in kg (null if not set)
  workouts: 4,              // Weekly workouts count
  workoutsGoal: 5,          // Weekly workout goal
  activeMinutes: 45         // Active minutes today
}
```

### `stats` Object

Contains weekly summary data:

```javascript
{
  thisWeek: {
    workouts: 4,            // Number of workouts this week
    totalTime: '3h 12m',    // Total workout time
    calories: 1240,         // Total calories burned
    weight: 70              // Current weight
  }
}
```

### Other Properties

- `isLoading` - Boolean indicating if data is being fetched
- `lastUpdated` - Date object of last update
- `saveActivity(activityType, value)` - Function to save activity data
- `updateGoals(goalUpdates)` - Function to update goals
- `calculatePercentage(current, goal)` - Helper to calculate progress percentage

## Saving Activity Data

### Using `saveActivity()`

The context provides a `saveActivity()` function that saves data to Firestore:

```javascript
const { saveActivity } = useMetrics();

const handleLogSteps = async () => {
  const result = await saveActivity('steps', 8547);

  if (result.success) {
    console.log('Steps saved successfully!');
  } else {
    console.error('Error:', result.error);
  }
};
```

**Supported activity types:**
- `'steps'` - Log step count
- `'calories'` - Log calories burned
- `'water'` - Log water intake (glasses)
- `'sleep'` - Log sleep duration (hours)

### What Gets Saved

When you call `saveActivity()`, it saves:
- The specific field you're updating
- ALL other current metrics (for complete daily snapshot)
- Metadata (date, userId, timestamp, last updated field)
- Weekly summary data
- Progress percentages

This comprehensive save ensures you always have complete data for charts and progress tracking.

## Updating Goals

Use `updateGoals()` to change daily goals:

```javascript
const { updateGoals } = useMetrics();

const handleUpdateGoals = async () => {
  const result = await updateGoals({
    stepsGoal: 12000,
    caloriesGoal: 600,
    waterGoal: 10
  });

  if (result.success) {
    console.log('Goals updated!');
  }
};
```

## Example: Progress Page

Here's how you might use MetricsContext in a Progress page:

```javascript
import { useMetrics } from '../context/MetricsContext';
import { formatValue, formatNumber } from '../utils/formatters';

function Progress() {
  const { metrics, stats, isLoading } = useMetrics();

  if (isLoading) {
    return <div>Loading your progress...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>

      {/* Daily Metrics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Activity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-600">Steps</p>
            <p className="text-2xl font-bold">{formatNumber(metrics.steps)}</p>
            <p className="text-sm text-gray-500">Goal: {metrics.stepsGoal.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-600">Calories</p>
            <p className="text-2xl font-bold">{formatValue(metrics.calories)}</p>
            <p className="text-sm text-gray-500">Goal: {metrics.caloriesGoal}</p>
          </div>
        </div>
      </section>

      {/* Weekly Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">This Week</h2>
        <div className="bg-white p-6 rounded-lg">
          <p>Workouts: {formatValue(stats.thisWeek.workouts)}</p>
          <p>Total Time: {formatValue(stats.thisWeek.totalTime)}</p>
          <p>Calories Burned: {formatValue(stats.thisWeek.calories)}</p>
        </div>
      </section>
    </div>
  );
}

export default Progress;
```

## Example: Profile Page

Use metrics to show user profile data:

```javascript
function Profile() {
  const { metrics } = useMetrics();

  return (
    <div>
      <h1>Your Profile</h1>
      <p>Current Weight: {formatValue(metrics.weight, 'kg')}</p>
      <p>Daily Step Goal: {metrics.stepsGoal.toLocaleString()}</p>
      <p>Weekly Workout Goal: {metrics.workoutsGoal}</p>
    </div>
  );
}
```

## Real-Time Updates

The context uses Firestore's `onSnapshot` listener, which means:

✅ **Automatic updates** - When data changes in Firestore, all components using `useMetrics()` update automatically
✅ **No manual refresh needed** - UI stays in sync with database
✅ **Multiple tabs supported** - Changes in one tab reflect in another

## Performance Considerations

✅ **Single listener** - Only one Firestore listener for the entire app
✅ **Shared state** - All components share the same data (no duplicate fetches)
✅ **Efficient updates** - React context only re-renders components that use the changed data

## Best Practices

1. **Always use formatters** - Combine with `utils/formatters.js` to handle null values:
   ```javascript
   {formatValue(metrics.steps)}  // Shows "N/A" if null
   ```

2. **Check loading state** - Show loading UI while data is being fetched:
   ```javascript
   if (isLoading) return <Spinner />;
   ```

3. **Handle errors gracefully** - Check the result of `saveActivity()`:
   ```javascript
   const result = await saveActivity('steps', value);
   if (!result.success) {
     // Show error message
   }
   ```

4. **Don't destructure everything** - Only destructure what you need:
   ```javascript
   // Good - only what you need
   const { metrics, isLoading } = useMetrics();

   // Bad - unnecessary destructuring
   const { metrics, stats, isLoading, saveActivity, updateGoals, calculatePercentage } = useMetrics();
   ```

## Architecture

```
App.jsx
  └─ AuthProvider (provides user)
      └─ MetricsProvider (needs user, provides metrics)
          └─ Your Components
              └─ useMetrics() hook to access data
```

**Important**: MetricsProvider is wrapped inside AuthProvider because it needs the authenticated user to fetch data.

## Troubleshooting

**Problem**: "useMetrics must be used within a MetricsProvider"
- **Solution**: Make sure MetricsProvider is in App.jsx and wraps your routes

**Problem**: Data shows as null/N/A
- **Solution**: Use Quick Actions to log your first activity. The context will automatically update.

**Problem**: Data not updating after save
- **Solution**: Check that Firestore rules allow writes to `users/{userId}/activity/{date}`

---

**Remember**: Use `useMetrics()` in any component that needs access to fitness data. The context handles all the complexity of fetching, updating, and syncing data!

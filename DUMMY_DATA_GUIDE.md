# Dummy Data Generator Guide

This guide explains how to generate realistic test data for your GetFit app.

## What Gets Generated

The dummy data generator creates **30 days** of realistic fitness tracking data:

### 📊 Daily Activity Metrics (30 days)
- **Steps**: 5,000-15,000 steps per day (varies by weekday/weekend)
- **Calories Burned**: 300-700 kcal per day
- **Water Intake**: 5-10 glasses per day
- **Sleep**: 6-9 hours per day
- **Weight**: Progressive weight loss from 85kg → ~80kg (with daily fluctuations)
- **Active Minutes**: 30-90 minutes per day

### 💪 Workout Sessions (~20 workouts)
- **Frequency**: 4 workouts per week (Monday, Wednesday, Friday, Saturday)
- **Types**: Push Day, Pull Day, Leg Day, Full Body
- **Duration**: 45-75 minutes per session
- **Exercises**: 5 exercises per workout with 3-4 sets each
- **Progressive Overload**: Weights increase ~2% per week
- **Full Set Data**: Every set includes weight, reps, and volume

### 📈 Weekly/Monthly Aggregates
- Weekly workout counts
- Weekly total volume
- Weekly calorie burns
- Monthly trends and statistics

## How to Use

### Method 1: Using the Dev Tools Page (Recommended)

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Login to your account** (or create one if needed)

3. **Navigate to Dev Tools**:
   - Go to: `http://localhost:5173/dev-tools`
   - Or manually type the URL in your browser

4. **Click "Generate Dummy Data"**:
   - Confirm the prompt
   - Wait 10-20 seconds for generation to complete
   - Check the success message and statistics

5. **Verify the data**:
   - Visit **Dashboard** (`/dashboard`) to see daily metrics
   - Visit **Progress** (`/progress`) to see charts and workout history
   - Check Firebase Console for raw data

### Method 2: Using Browser Console

1. **Login to your account**

2. **Open browser console** (F12 or Cmd+Option+I)

3. **Import and run the generator**:
   ```javascript
   import { generateAndPushDummyData } from './src/utils/generateDummyData.js';

   // Get current user ID
   const userId = 'YOUR_USER_ID'; // Replace with your Firebase user ID

   // Generate data
   await generateAndPushDummyData(userId);
   ```

## Generated Data Structure

### Daily Activity Document
```
users/{userId}/activity/{date}
{
  date: "2025-01-15",
  userId: "abc123",
  steps: 8547,
  stepsGoal: 10000,
  calories: 420,
  caloriesGoal: 500,
  water: 7,
  waterGoal: 8,
  sleep: 7.5,
  sleepGoal: 8,
  weight: 82.3,
  weeklyWorkouts: 4,
  weeklyTotalTime: "4h 25m",
  weeklyCaloriesBurned: 1850,
  updatedAt: Timestamp
}
```

### Workout Session Document
```
users/{userId}/workoutSessions/{sessionId}
{
  userId: "abc123",
  routineName: "Push Pull Legs - Intermediate",
  workoutDayName: "Push Day",
  startTime: Timestamp,
  endTime: Timestamp,
  duration: 60,
  totalVolume: 4532,
  totalSets: 15,
  totalReps: 150,
  exercises: [
    {
      exerciseName: "barbell bench press",
      sets: [
        { setNumber: 1, reps: 10, weight: 60, completed: true },
        { setNumber: 2, reps: 9, weight: 57.5, completed: true },
        ...
      ],
      totalVolume: 1745
    },
    ...
  ]
}
```

## Sample Exercises Included

### Push Day
- Barbell Bench Press (60kg base)
- Dumbbell Shoulder Press (20kg base)
- Barbell Incline Bench Press (50kg base)
- Dumbbell Triceps Extension (12kg base)
- Dumbbell Lateral Raise (10kg base)

### Pull Day
- Barbell Bent Over Row (50kg base)
- Assisted Pull-Up (40kg base)
- Dumbbell One Arm Row (22kg base)
- Barbell Curl (25kg base)
- Dumbbell Hammer Curl (12kg base)

### Leg Day
- Barbell Squat (70kg base)
- Barbell Romanian Deadlift (60kg base)
- Dumbbell Lunge (15kg base)
- Leg Press (100kg base)
- Calf Raise (bodyweight)

### Full Body
- Mix of compound movements from all muscle groups

## Expected Results

After generation, you should see:

### Dashboard Page
- ✅ Current weight displayed
- ✅ This week's workout count
- ✅ Daily metrics (steps, calories, water, sleep) with progress bars
- ✅ Active program showing real data

### Progress Page - Overview Tab
- ✅ Total workouts: ~20
- ✅ This week workouts: ~4
- ✅ Total volume: ~90,000 kg
- ✅ Total time: ~20 hours
- ✅ Workout frequency chart (last 7 days)
- ✅ Weight progress chart

### Progress Page - Workout History Tab
- ✅ List of all 20 workout sessions
- ✅ Expandable details showing all exercises and sets
- ✅ Volume and duration for each workout

### Progress Page - Weight Tab
- ✅ Line chart showing weight loss from 85kg → ~80kg
- ✅ Clear downward trend with natural fluctuations

### Progress Page - PRs Tab
- ✅ Top 10 exercises ranked by max weight
- ✅ Personal records for each exercise
- ✅ Progress charts for each exercise

## Troubleshooting

### Issue: "You must be logged in"
**Solution**: Make sure you're logged in before accessing `/dev-tools`

### Issue: "Failed to generate data"
**Solution**:
- Check browser console for error messages
- Verify Firebase connection
- Ensure Firestore rules allow writes to `activity` and `workoutSessions` collections

### Issue: Data not showing in Dashboard/Progress
**Solution**:
- Refresh the page
- Check Firebase Console to verify data was written
- Check browser console for errors

### Issue: Generation takes too long
**Solution**:
- This is normal - generating and uploading 30+ documents takes time
- Wait up to 30 seconds
- Don't refresh the page during generation

## Clearing Data

To clear dummy data:

1. **Manual method** (Firebase Console):
   - Go to Firebase Console → Firestore Database
   - Navigate to `users/{userId}/activity/`
   - Delete all activity documents
   - Navigate to `users/{userId}/workoutSessions/`
   - Delete all session documents

2. **Note**: Automated clearing is not implemented to prevent accidental data loss

## Tips for Testing

1. **Generate once per user** - Running multiple times will create duplicate data

2. **Test different scenarios**:
   - New user (no data) → Generate → See populated dashboard
   - Existing user → Generate → See combined data

3. **Use different time ranges**:
   - Modify `generateDailyActivities()` days parameter for different ranges
   - Adjust `generateWorkoutSessions()` weeks parameter

4. **Customize weights**:
   - Edit `EXERCISES` object in `generateDummyData.js`
   - Adjust `baseWeight` values for different difficulty levels

## Firebase Security

The dummy data generator respects your Firestore security rules:
- Only generates data for the logged-in user
- Uses proper Firebase auth context
- All writes go through standard security checks

## Next Steps

After generating dummy data:

1. ✅ Test all dashboard features
2. ✅ Verify charts render correctly
3. ✅ Check workout history expandable cards
4. ✅ Validate PR calculations
5. ✅ Test responsive design on mobile
6. ✅ Share screenshots with stakeholders
7. ✅ Use for user testing and feedback

---

**Happy Testing! 🎉**

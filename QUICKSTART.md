# 🚀 Quick Start Guide - Generate Test Data

Follow these simple steps to populate your GetFit app with realistic test data.

## Step 1: Start the App

```bash
npm run dev
```

## Step 2: Login to Your Account

- Navigate to `http://localhost:5173`
- Login with your existing account
- Or create a new account if needed

## Step 3: Access Dev Tools

Open your browser and go to:
```
http://localhost:5173/dev-tools
```

## Step 4: Generate Data

1. Click the **"Generate Dummy Data"** button
2. Confirm the prompt
3. Wait 10-20 seconds ⏳
4. See success message with statistics ✅

## Step 5: Explore Your Data

### 📊 Dashboard (`/dashboard`)
- View today's metrics (steps, calories, water, sleep)
- See your active workout program
- Check weekly summary

### 📈 Progress Page (`/progress`)

**Overview Tab:**
- Summary statistics cards
- Workout frequency chart (last 7 days)
- Weight progress chart
- Recent workout list

**Workout History Tab:**
- All 20 workout sessions
- Click to expand and see exercise details
- View sets, reps, and weights

**Weight Tab:**
- Detailed weight progress chart
- Start: 85kg → Current: ~80kg
- Shows 30-day trend

**Personal Records Tab:**
- Top exercises ranked by max weight
- Max weight, max volume, max reps
- Mini progress charts for each exercise

## What You'll See

### ✅ Generated Data Summary
- **30 days** of daily activities
- **~20 workout sessions** (4 per week)
- **Weight progression**: 85kg → 80kg
- **~90,000 kg** total volume lifted
- **~20 hours** total workout time
- **Progressive overload** in all exercises

### 📱 Sample Stats
```
Total Workouts: 20
This Week: 4 workouts
Total Volume: 90,234 kg
Total Time: 1,185 minutes
Steps (last 7 days): ~60,000 steps
Water intake: 6-9 glasses/day
Sleep: 7-8 hours/night
```

## Troubleshooting

**Can't find Dev Tools page?**
- Manually type: `http://localhost:5173/dev-tools`

**Not logged in error?**
- Make sure you're logged in first
- Go to `/login` and sign in

**Data not showing?**
- Refresh the page
- Check Firebase Console
- Open browser console (F12) for errors

**Generation failed?**
- Check internet connection
- Verify Firebase is configured
- Check browser console for errors

## Next Steps

After generating data:

1. ✅ Test all features with real data
2. ✅ Take screenshots for documentation
3. ✅ Share with team/stakeholders
4. ✅ Test on mobile responsive views
5. ✅ Verify all charts render correctly

## Need More Help?

See the full guide: [DUMMY_DATA_GUIDE.md](./DUMMY_DATA_GUIDE.md)

---

**Happy Testing! 💪**

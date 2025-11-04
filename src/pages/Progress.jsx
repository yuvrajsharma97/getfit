import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FiTrendingUp, FiActivity, FiCalendar, FiAward } from 'react-icons/fi';
import WeightProgressChart from '../components/progress/WeightProgressChart';
import WorkoutFrequencyChart from '../components/progress/WorkoutFrequencyChart';
import ExercisePRChart from '../components/progress/ExercisePRChart';
import WorkoutHistoryList from '../components/progress/WorkoutHistoryList';

const Progress = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    totalDuration: 0,
    thisWeekWorkouts: 0,
    thisMonthWorkouts: 0,
  });

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      // Load workout sessions
      const sessionsRef = collection(db, 'users', user.uid, 'workoutSessions');
      const sessionsQuery = query(
        sessionsRef,
        orderBy('startTime', 'desc'),
        limit(50)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
      }));

      setWorkoutHistory(sessions);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = sessions.filter(s => s.startTime >= weekAgo);
      const thisMonth = sessions.filter(s => s.startTime >= monthAgo);

      setStats({
        totalWorkouts: sessions.length,
        totalVolume: sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0),
        totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        thisWeekWorkouts: thisWeek.length,
        thisMonthWorkouts: thisMonth.length,
      });

      // Load weight history from activity documents
      const activityRef = collection(db, 'users', user.uid, 'activity');
      const activityQuery = query(activityRef, orderBy('date', 'desc'), limit(30));
      const activitySnapshot = await getDocs(activityQuery);
      const weightData = activitySnapshot.docs
        .map(doc => ({
          date: doc.data().date,
          weight: doc.data().weight,
        }))
        .filter(d => d.weight != null)
        .reverse();

      setWeightHistory(weightData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'workouts', label: 'Workout History', icon: FiCalendar },
    { id: 'weight', label: 'Weight', icon: FiTrendingUp },
    { id: 'prs', label: 'Personal Records', icon: FiAward },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Progress</h1>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading progress data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Workouts"
                    value={stats.totalWorkouts}
                    icon={FiActivity}
                    color="indigo"
                  />
                  <StatCard
                    title="This Week"
                    value={stats.thisWeekWorkouts}
                    suffix="workouts"
                    icon={FiCalendar}
                    color="emerald"
                  />
                  <StatCard
                    title="Total Volume"
                    value={Math.round(stats.totalVolume)}
                    suffix="kg"
                    icon={FiTrendingUp}
                    color="blue"
                  />
                  <StatCard
                    title="Total Time"
                    value={Math.round(stats.totalDuration)}
                    suffix="min"
                    icon={FiAward}
                    color="purple"
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Workout Frequency</h3>
                    <WorkoutFrequencyChart workouts={workoutHistory} />
                  </div>

                  {weightHistory.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Weight Progress</h3>
                      <WeightProgressChart data={weightHistory} />
                    </div>
                  )}
                </div>

                {/* Recent Workouts */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Workouts</h3>
                  <WorkoutHistoryList workouts={workoutHistory.slice(0, 5)} />
                </div>
              </div>
            )}

            {/* Workout History Tab */}
            {selectedTab === 'workouts' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Workout History</h3>
                <WorkoutHistoryList workouts={workoutHistory} showAll />
              </div>
            )}

            {/* Weight Tab */}
            {selectedTab === 'weight' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Weight Progress</h3>
                {weightHistory.length > 0 ? (
                  <WeightProgressChart data={weightHistory} detailed />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-600">No weight data available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Start tracking your weight in the dashboard.</p>
                  </div>
                )}
              </div>
            )}

            {/* PRs Tab */}
            {selectedTab === 'prs' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Records</h3>
                <ExercisePRChart workouts={workoutHistory} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, suffix = '', icon: Icon, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
};

export default Progress;

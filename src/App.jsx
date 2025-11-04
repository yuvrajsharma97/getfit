import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MetricsProvider } from './context/MetricsContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutsLibrary from './pages/WorkoutsLibrary';
import WorkoutTemplateDetail from './pages/WorkoutTemplateDetail';
import ActiveWorkout from './pages/ActiveWorkout';
import WorkoutSession from './pages/WorkoutSession';
import Progress from './pages/Progress';
import DevTools from './pages/DevTools';
import ProtectedRoute from './components/common/ProtectedRoute';
import OnboardingGuard from './components/common/OnboardingGuard';
import Navigation from './components/common/Navigation';

// Layout component for protected routes with navigation
const AppLayout = ({ children }) => {
  return (
    <>
      <Navigation />
      {/* Main content with sidebar offset on desktop */}
      <div className="lg:ml-64 min-h-screen">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <MetricsProvider>
            <OnboardingProvider>
              <ExerciseProvider>
                <WorkoutProvider>
                  <Routes>
                {/* Dashboard Route - Redirects to Login if not authenticated */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Onboarding Route (Protected) */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes with Navigation */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/exercises"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <ExerciseLibrary />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workouts"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <WorkoutsLibrary />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workouts/:workoutId"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <WorkoutTemplateDetail />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/active-workout"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <ActiveWorkout />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workout-session"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <WorkoutSession />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Progress Route */}
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <Progress />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <div className="flex items-center justify-center min-h-screen">
                            <h1 className="text-2xl font-bold text-gray-900">Profile Page - Coming Soon</h1>
                          </div>
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Dev Tools Route - For generating dummy data */}
                <Route
                  path="/dev-tools"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <AppLayout>
                          <DevTools />
                        </AppLayout>
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />
                  </Routes>
                </WorkoutProvider>
              </ExerciseProvider>
            </OnboardingProvider>
          </MetricsProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

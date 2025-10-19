import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasCompletedOnboarding } from '../../services/firestore';
import Loading from '../ui/Loading';

const OnboardingGuard = ({ children }) => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const isCompleted = await hasCompletedOnboarding(user.uid);
        setCompleted(isCompleted);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setCompleted(false);
      } finally {
        setChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // Show loading while checking
  if (checking) {
    return <Loading fullScreen text="Loading your profile..." />;
  }

  // Redirect to onboarding if not completed
  if (!completed) {
    console.log('Onboarding not completed, redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // Render children if onboarding is completed
  return children;
};

export default OnboardingGuard;

import { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext({});

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    goals: [],
    experienceLevel: '',
    equipment: [],
    workoutFrequency: '',
  });

  const totalSteps = 6;

  const updateData = (field, value) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayItem = (field, item) => {
    setOnboardingData((prev) => {
      const currentArray = prev[field] || [];
      const exists = currentArray.includes(item);

      return {
        ...prev,
        [field]: exists
          ? currentArray.filter((i) => i !== item)
          : [...currentArray, item],
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setOnboardingData({
      goals: [],
      experienceLevel: '',
      equipment: [],
      workoutFrequency: '',
    });
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return true; // Welcome screen, always valid
      case 2:
        return onboardingData.goals.length > 0;
      case 3:
        return onboardingData.experienceLevel !== '';
      case 4:
        return onboardingData.equipment.length > 0;
      case 5:
        return onboardingData.workoutFrequency !== '';
      case 6:
        return true; // Summary screen
      default:
        return false;
    }
  };

  const canContinue = isStepValid(currentStep);

  const value = {
    currentStep,
    totalSteps,
    onboardingData,
    updateData,
    toggleArrayItem,
    nextStep,
    prevStep,
    goToStep,
    resetOnboarding,
    canContinue,
    isStepValid,
    progress: ((currentStep - 1) / (totalSteps - 1)) * 100,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTarget,
  FiTrendingUp,
  FiActivity,
  FiAward,
  FiHeart,
  FiZap,
  FiUsers,
  FiHome,
  FiPackage,
  FiCalendar,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiStar,
  FiTool,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { OnboardingProvider, useOnboarding } from '../context/OnboardingContext';
import { saveOnboardingData } from '../services/firestore';
import ProgressBar from '../components/onboarding/ProgressBar';
import SelectionCard from '../components/onboarding/SelectionCard';
import StepContainer from '../components/onboarding/StepContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Step 1: Welcome Screen
const WelcomeStep = () => {
  const { nextStep } = useOnboarding();

  return (
    <StepContainer>
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FiStar className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to GetFit!
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Let's personalize your fitness journey. We'll ask you a few questions to create a customized experience tailored to your goals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-primary-50 rounded-lg p-4">
            <FiTarget className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Set Your Goals</p>
          </div>
          <div className="bg-success-50 rounded-lg p-4">
            <FiActivity className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Track Progress</p>
          </div>
          <div className="bg-warning-50 rounded-lg p-4">
            <FiAward className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Achieve Results</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="group"
        >
          Get Started
          <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-sm text-gray-500 mt-6">
          Takes only 2 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
};

// Step 2: Fitness Goals
const GoalsStep = () => {
  const { onboardingData, toggleArrayItem } = useOnboarding();

  const goals = [
    {
      id: 'weight-loss',
      title: 'Weight Loss',
      description: 'Burn fat and achieve a leaner physique',
      icon: FiTrendingUp,
    },
    {
      id: 'muscle-gain',
      title: 'Muscle Gain',
      description: 'Build strength and increase muscle mass',
      icon: FiActivity,
    },
    {
      id: 'strength',
      title: 'Strength Training',
      description: 'Get stronger and lift heavier weights',
      icon: FiZap,
    },
    {
      id: 'endurance',
      title: 'Endurance/Cardio',
      description: 'Improve stamina and cardiovascular health',
      icon: FiHeart,
    },
    {
      id: 'flexibility',
      title: 'Flexibility/Mobility',
      description: 'Increase range of motion and prevent injury',
      icon: FiActivity,
    },
    {
      id: 'general',
      title: 'General Fitness',
      description: 'Overall health and well-being',
      icon: FiUsers,
    },
  ];

  return (
    <StepContainer>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          What are your primary fitness goals?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Select all that apply - we'll customize your experience
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <SelectionCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              selected={onboardingData.goals.includes(goal.id)}
              onClick={() => toggleArrayItem('goals', goal.id)}
            />
          ))}
        </div>
      </div>
    </StepContainer>
  );
};

// Step 3: Experience Level
const ExperienceLevelStep = () => {
  const { onboardingData, updateData } = useOnboarding();

  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to working out or returning after a break',
      icon: FiUsers,
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Working out regularly for 6+ months',
      icon: FiActivity,
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Training consistently for 2+ years',
      icon: FiTrendingUp,
    },
    {
      id: 'athlete',
      title: 'Athlete',
      description: 'Competitive or professional athlete',
      icon: FiAward,
    },
  ];

  return (
    <StepContainer>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          What's your fitness experience level?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          This helps us recommend appropriate workout intensity
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {levels.map((level) => (
            <SelectionCard
              key={level.id}
              icon={level.icon}
              title={level.title}
              description={level.description}
              selected={onboardingData.experienceLevel === level.id}
              onClick={() => updateData('experienceLevel', level.id)}
            />
          ))}
        </div>
      </div>
    </StepContainer>
  );
};

// Step 4: Available Equipment
const EquipmentStep = () => {
  const { onboardingData, toggleArrayItem } = useOnboarding();

  const equipment = [
    {
      id: 'full-gym',
      title: 'Full Gym Access',
      description: 'Barbells, machines, cables, and more',
      icon: FiTool,
    },
    {
      id: 'home-gym',
      title: 'Home Gym',
      description: 'Dumbbells, bench, rack, and basics',
      icon: FiHome,
    },
    {
      id: 'minimal',
      title: 'Minimal Equipment',
      description: 'Dumbbells, resistance bands, basics',
      icon: FiPackage,
    },
    {
      id: 'bodyweight',
      title: 'Bodyweight Only',
      description: 'No equipment needed',
      icon: FiActivity,
    },
    {
      id: 'cardio',
      title: 'Cardio Equipment',
      description: 'Treadmill, bike, rower, etc.',
      icon: FiHeart,
    },
  ];

  return (
    <StepContainer>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          What equipment do you have access to?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Select all that apply - we'll suggest suitable exercises
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {equipment.map((item) => (
            <SelectionCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              selected={onboardingData.equipment.includes(item.id)}
              onClick={() => toggleArrayItem('equipment', item.id)}
            />
          ))}
        </div>
      </div>
    </StepContainer>
  );
};

// Step 5: Workout Frequency
const FrequencyStep = () => {
  const { onboardingData, updateData } = useOnboarding();

  const frequencies = [
    {
      id: '2-3',
      title: '2-3 days per week',
      description: 'Perfect for beginners or busy schedules',
      icon: FiCalendar,
    },
    {
      id: '4',
      title: '4 days per week',
      description: 'Great balance for steady progress',
      icon: FiCalendar,
    },
    {
      id: '5',
      title: '5 days per week',
      description: 'Committed training schedule',
      icon: FiCalendar,
    },
    {
      id: '6+',
      title: '6+ days per week',
      description: 'Advanced or athlete-level training',
      icon: FiCalendar,
    },
  ];

  return (
    <StepContainer>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          How many days per week can you commit?
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Be realistic - consistency is more important than volume
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {frequencies.map((freq) => (
            <SelectionCard
              key={freq.id}
              icon={freq.icon}
              title={freq.title}
              description={freq.description}
              selected={onboardingData.workoutFrequency === freq.id}
              onClick={() => updateData('workoutFrequency', freq.id)}
            />
          ))}
        </div>
      </div>
    </StepContainer>
  );
};

// Step 6: Summary & Confirmation
const SummaryStep = () => {
  const { onboardingData, goToStep } = useOnboarding();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const goalLabels = {
    'weight-loss': 'Weight Loss',
    'muscle-gain': 'Muscle Gain',
    'strength': 'Strength Training',
    'endurance': 'Endurance/Cardio',
    'flexibility': 'Flexibility/Mobility',
    'general': 'General Fitness',
  };

  const experienceLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    athlete: 'Athlete',
  };

  const equipmentLabels = {
    'full-gym': 'Full Gym Access',
    'home-gym': 'Home Gym',
    'minimal': 'Minimal Equipment',
    'bodyweight': 'Bodyweight Only',
    'cardio': 'Cardio Equipment',
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      setError('');

      await saveOnboardingData(user.uid, onboardingData);

      // Success! Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving onboarding:', err);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepContainer>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Fitness Profile
          </h2>
          <p className="text-gray-600">
            Review your selections and start your journey!
          </p>
        </div>

        <Card className="mb-6">
          {/* Goals */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Fitness Goals
            </h3>
            <div className="flex flex-wrap gap-2">
              {onboardingData.goals.map((goal) => (
                <span
                  key={goal}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {goalLabels[goal]}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Experience Level
            </h3>
            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
              {experienceLabels[onboardingData.experienceLevel]}
            </span>
          </div>

          {/* Equipment */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Available Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {onboardingData.equipment.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-sm font-medium"
                >
                  {equipmentLabels[item]}
                </span>
              ))}
            </div>
          </div>

          {/* Workout Frequency */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Workout Frequency
            </h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {onboardingData.workoutFrequency} days/week
            </span>
          </div>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => goToStep(2)}
            className="sm:flex-1"
            disabled={saving}
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Edit Preferences
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleComplete}
            loading={saving}
            className="sm:flex-1"
          >
            {saving ? 'Saving...' : 'Start My Journey!'}
          </Button>
        </div>
      </div>
    </StepContainer>
  );
};

// Main Onboarding Component
const OnboardingContent = () => {
  const { currentStep, totalSteps, nextStep, prevStep, canContinue } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <GoalsStep />;
      case 3:
        return <ExperienceLevelStep />;
      case 4:
        return <EquipmentStep />;
      case 5:
        return <FrequencyStep />;
      case 6:
        return <SummaryStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar (hidden on welcome and summary) */}
        {currentStep !== 1 && currentStep !== 6 && (
          <ProgressBar current={currentStep} total={totalSteps} />
        )}

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation Buttons (hidden on welcome and summary) */}
        {currentStep !== 1 && currentStep !== 6 && (
          <div className="flex justify-between max-w-3xl mx-auto">
            <Button
              variant="ghost"
              size="lg"
              onClick={prevStep}
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={nextStep}
              disabled={!canContinue}
              className="group"
            >
              Continue
              <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper with Provider
const Onboarding = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default Onboarding;

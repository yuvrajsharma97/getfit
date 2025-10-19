import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { hasCompletedOnboarding } from '../services/firestore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (user) {
        console.log('User already logged in, checking onboarding status...');
        const completed = await hasCompletedOnboarding(user.uid);

        if (completed) {
          console.log('Onboarding completed, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('Onboarding not completed, redirecting to onboarding');
          navigate('/onboarding');
        }

        setLocalLoading(false); // Reset loading state before redirect
      }
    };

    checkAndRedirect();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return false;
    }

    if (fullName.trim().length < 2) {
      setLocalError('Please enter your full name.');
      return false;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLocalLoading(true);
      await signUp(formData.email, formData.password, formData.fullName);
      // Don't navigate here - let useEffect handle it when user state updates
    } catch (error) {
      console.error('Sign up error:', error);
      setLocalError(getErrorMessage(error.code));
      setLocalLoading(false); // Only set loading to false on error
    }
    // Don't set loading to false here - let useEffect redirect first
  };

  const handleGoogleSignUp = async () => {
    setLocalError('');

    try {
      setLocalLoading(true);
      await signInWithGoogle();
      // Don't navigate here - let useEffect handle it when user state updates
    } catch (error) {
      console.error('Google sign up error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setLocalError('Sign up cancelled.');
      } else {
        setLocalError(getErrorMessage(error.code));
      }
      setLocalLoading(false); // Only set loading to false on error
    }
    // Don't set loading to false here - let useEffect redirect first
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Start Your Fitness Journey
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of users achieving their fitness goals with GetFit. Transform your body, transform your life.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Forever</h3>
                <p className="text-white/80">Get started with all premium features at no cost.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Data-Driven Insights</h3>
                <p className="text-white/80">Make informed decisions with comprehensive analytics.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Quick Setup</h3>
                <p className="text-white/80">Start tracking your workouts in under 2 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient">GetFit</h1>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Start your fitness journey today, completely free
              </p>
            </div>

            {/* Error Message */}
            {localError && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-start gap-3 animate-slide-down">
                <svg
                  className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-error-700">{localError}</span>
              </div>
            )}

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              disabled={localLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <Input
                type="text"
                name="fullName"
                label="Full name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={localLoading}
                required
                icon={HiUser}
              />

              <Input
                type="email"
                name="email"
                label="Email address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={localLoading}
                required
                icon={HiMail}
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={localLoading}
                required
                icon={HiLockClosed}
                helperText="Minimum 6 characters"
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirm password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={localLoading}
                required
                icon={HiLockClosed}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={localLoading}
                disabled={localLoading}
                className="mt-2"
              >
                Create account
              </Button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-smooth"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

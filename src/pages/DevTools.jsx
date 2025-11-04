import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateAndPushDummyData } from '../utils/generateDummyData';
import { FiDatabase, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const DevTools = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerateData = async () => {
    if (!user?.uid) {
      toast.error('You must be logged in to generate data');
      return;
    }

    if (!window.confirm('This will generate 30 days of dummy data. Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await generateAndPushDummyData(user.uid);
      setResult(res);

      if (res.success) {
        toast.success('Dummy data generated successfully!', 5000);
      } else {
        toast.error(`Failed to generate data: ${res.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while generating data');
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FiDatabase className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Developer Tools</h1>
          </div>
          <p className="text-gray-600">
            Generate test data for development and testing purposes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <FiAlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Development Environment Only
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                This tool is for testing purposes. It will create dummy data in your Firebase database.
              </p>
            </div>
          </div>
        </div>

        {/* Firebase Setup Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <FiDatabase className="w-5 h-5" />
            First Time Setup Required
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            If you get a "Missing permissions" error, you need to deploy Firestore security rules first:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 mb-4">
            <li>
              Open{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-blue-900"
              >
                Firebase Console
              </a>
            </li>
            <li>Go to Firestore Database → Rules tab</li>
            <li>Copy rules from <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">firestore.rules</code> file</li>
            <li>Paste and click "Publish"</li>
          </ol>
          <p className="text-xs text-blue-700">
            📖 See <strong>FIREBASE_SETUP.md</strong> for detailed instructions
          </p>
        </div>

        {/* Current User Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Current User</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {user?.uid || 'Not logged in'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="text-gray-900">{user?.displayName || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Generate Data Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Generate Dummy Data</h3>
          <p className="text-gray-600 mb-6 text-sm">
            This will create 30 days of realistic fitness data including:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>30 days</strong> of daily activity (steps, calories, water, sleep)
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>~20 workout sessions</strong> with full exercise logs
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Weight progression</strong> from 85kg to ~80kg
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Progressive overload</strong> in exercise weights
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Weekly/monthly aggregates</strong> for all metrics
              </span>
            </li>
          </ul>

          <button
            onClick={handleGenerateData}
            disabled={loading || !user}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Generating Data...
              </>
            ) : (
              <>
                <FiDatabase className="w-5 h-5" />
                Generate Dummy Data
              </>
            )}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`rounded-xl border p-6 ${
            result.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <FiAlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-bold mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </h4>

                {result.success ? (
                  <div className="space-y-2 text-sm text-green-800">
                    <p>Dummy data has been generated and pushed to Firebase.</p>
                    <div className="bg-white rounded-lg p-4 mt-4">
                      <h5 className="font-semibold mb-3 text-gray-900">Summary:</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-gray-600">Daily Activities:</span>
                          <p className="font-bold text-gray-900">{result.stats.activities} days</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Workout Sessions:</span>
                          <p className="font-bold text-gray-900">{result.stats.sessions} workouts</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Start Weight:</span>
                          <p className="font-bold text-gray-900">{result.stats.startWeight} kg</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Weight:</span>
                          <p className="font-bold text-gray-900">{result.stats.endWeight} kg</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-green-700">
                      You can now visit the Dashboard and Progress pages to see the generated data!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-800 font-semibold">
                      {result.error || 'An unknown error occurred'}
                    </p>

                    {(result.error?.includes('Permission') || result.error?.includes('permission')) && (
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4 mt-3">
                        <h5 className="font-semibold text-red-900 mb-2">How to Fix:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                          <li>
                            Go to{' '}
                            <a
                              href="https://console.firebase.google.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-semibold hover:text-red-900"
                            >
                              Firebase Console
                            </a>
                          </li>
                          <li>Select your project</li>
                          <li>Click "Firestore Database" → "Rules" tab</li>
                          <li>Copy rules from <code className="bg-red-200 px-1 rounded">firestore.rules</code> file</li>
                          <li>Paste and click "Publish"</li>
                          <li>Return here and try again</li>
                        </ol>
                        <p className="mt-3 text-xs text-red-700">
                          See <strong>FIREBASE_SETUP.md</strong> for detailed instructions
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Click "Generate Dummy Data" button above</li>
            <li>Wait for the process to complete (may take 10-20 seconds)</li>
            <li>Navigate to the Dashboard to see daily metrics</li>
            <li>Check the Progress page for charts and workout history</li>
            <li>Verify data in Firebase Console if needed</li>
          </ol>
        </div>

        {/* Console Output Note */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Check browser console for detailed generation logs</p>
        </div>
      </div>
    </div>
  );
};

export default DevTools;

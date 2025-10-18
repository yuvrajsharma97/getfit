import { createContext, useContext, useState, useEffect } from 'react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthStateChange
} from '../services/firebase';
import { createUserDocument, getUserDocument } from '../services/firestore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('User authenticated:', firebaseUser.uid);

          // Fetch additional user data from Firestore
          const userData = await getUserDocument(firebaseUser.uid);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userData
          });
        } else {
          console.log('No user authenticated');
          setUser(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Signing up new user...');
      const userCredential = await signUpWithEmail(email, password, displayName);

      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, {
        email: userCredential.user.email,
        displayName: displayName || '',
        photoURL: userCredential.user.photoURL || ''
      });

      console.log('Sign up completed successfully');
      return userCredential;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Signing in user...');
      const userCredential = await signInWithEmail(email, password);
      console.log('Sign in completed successfully');

      return userCredential;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleProvider = async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('Signing in with Google...');
      const userCredential = await signInWithGoogle();

      // Check if user document exists, if not create one
      const existingUser = await getUserDocument(userCredential.user.uid);
      if (!existingUser) {
        await createUserDocument(userCredential.user.uid, {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || ''
        });
      }

      console.log('Google sign in completed successfully');
      return userCredential;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('Signing out...');
      await firebaseSignOut();
      setUser(null);
      console.log('Sign out completed successfully');
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle: signInWithGoogleProvider,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

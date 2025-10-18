import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication Helper Functions

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<UserCredential>}
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    console.log('Creating user account with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      console.log('User profile updated with display name:', displayName);
    }

    console.log('User account created successfully:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error signing up with email:', error.code, error.message);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<UserCredential>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    console.log('Signing in with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error signing in with email:', error.code, error.message);
    throw error;
  }
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<UserCredential>}
 */
export const signInWithGoogle = async () => {
  try {
    console.log('Initiating Google sign in...');
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log('User signed in with Google:', userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error('Error signing in with Google:', error.code, error.message);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    console.log('Signing out user...');
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.code, error.message);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Update user profile
 * @param {Object} data - Profile data to update (displayName, photoURL)
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (data) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    console.log('Updating user profile...', data);
    await updateProfile(user, data);
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error.code, error.message);
    throw error;
  }
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;

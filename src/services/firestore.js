import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create a user document in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} userData - User data to store
 * @returns {Promise<void>}
 */
export const createUserDocument = async (userId, userData) => {
  try {
    console.log('Creating user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const userDoc = {
      uid: userId,
      email: userData.email,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData
    };

    await setDoc(userRef, userDoc);
    console.log('User document created successfully');
    return userDoc;
  } catch (error) {
    console.error('Error creating user document:', error.code, error.message);
    throw error;
  }
};

/**
 * Get a user document from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<Object|null>}
 */
export const getUserDocument = async (userId) => {
  try {
    console.log('Fetching user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('User document found');
      return userSnap.data();
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error.code, error.message);
    throw error;
  }
};

/**
 * Update a user document in Firestore
 * @param {string} userId - The user's unique ID
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateUserDocument = async (userId, data) => {
  try {
    console.log('Updating user document for:', userId);

    const userRef = doc(db, 'users', userId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);
    console.log('User document updated successfully');
  } catch (error) {
    console.error('Error updating user document:', error.code, error.message);
    throw error;
  }
};

import axios from 'axios';

// ExerciseDB API configuration
const EXERCISEDB_API_KEY = import.meta.env.VITE_EXERCISEDB_API_KEY;
const EXERCISEDB_BASE_URL = 'https://exercisedb.p.rapidapi.com';

// Create axios instance for ExerciseDB
const exerciseDBClient = axios.create({
  baseURL: EXERCISEDB_BASE_URL,
  headers: {
    'X-RapidAPI-Key': EXERCISEDB_API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
});

// ExerciseDB API functions
export const exerciseAPI = {
  // Get all exercises
  getAllExercises: async (limit = 10, offset = 0) => {
    try {
      const response = await exerciseDBClient.get(`/exercises`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Get exercise by ID
  getExerciseById: async (id) => {
    try {
      const response = await exerciseDBClient.get(`/exercises/exercise/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw error;
    }
  },

  // Get exercises by body part
  getExercisesByBodyPart: async (bodyPart) => {
    try {
      const response = await exerciseDBClient.get(`/exercises/bodyPart/${bodyPart}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by body part:', error);
      throw error;
    }
  },

  // Get exercises by target muscle
  getExercisesByTarget: async (target) => {
    try {
      const response = await exerciseDBClient.get(`/exercises/target/${target}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by target:', error);
      throw error;
    }
  },

  // Get exercises by equipment
  getExercisesByEquipment: async (equipment) => {
    try {
      const response = await exerciseDBClient.get(`/exercises/equipment/${equipment}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by equipment:', error);
      throw error;
    }
  },

  // Get list of body parts
  getBodyPartList: async () => {
    try {
      const response = await exerciseDBClient.get('/exercises/bodyPartList');
      return response.data;
    } catch (error) {
      console.error('Error fetching body part list:', error);
      throw error;
    }
  },

  // Get list of target muscles
  getTargetList: async () => {
    try {
      const response = await exerciseDBClient.get('/exercises/targetList');
      return response.data;
    } catch (error) {
      console.error('Error fetching target list:', error);
      throw error;
    }
  },

  // Get list of equipment
  getEquipmentList: async () => {
    try {
      const response = await exerciseDBClient.get('/exercises/equipmentList');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment list:', error);
      throw error;
    }
  }
};

export default exerciseDBClient;

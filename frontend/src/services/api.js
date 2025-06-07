import axios from 'axios';

// API base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all teams
export const fetchTeams = async () => {
  try {
    const response = await api.get('/predictions/teams/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Create a new prediction
export const createPrediction = async (predictionData) => {
  try {
    const response = await api.post('/predictions', predictionData);
    return response.data;
  } catch (error) {
    console.error('Error creating prediction:', error);
    throw error;
  }
};

// Get all predictions
export const getAllPredictions = async () => {
  try {
    const response = await api.get('/predictions');
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

// Get a single prediction by ID
export const getPredictionById = async (id) => {
  try {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching prediction ${id}:`, error);
    throw error;
  }
};

export default api;
import axios from 'axios';

// Use /api for Vercel deployment, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

export const getRecommendations = async (query) => {
  const response = await axios.post(`${API_URL}/recommend`, {
    query: query,
  });
  return response.data;
};

export const getMapInsight = async (latitude, longitude, businessType) => {
  const response = await axios.post(`${API_URL}/map-insight`, {
    latitude: latitude,
    longitude: longitude,
    business_type: businessType,
  });
  return response.data;
};

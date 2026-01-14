import axios from 'axios';

// Use /api for Vercel deployment
const API_URL = '/api';

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

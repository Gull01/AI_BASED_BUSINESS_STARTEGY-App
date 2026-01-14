import axios from 'axios';

// PythonAnywhere backend URL
const API_URL = 'https://gull001.pythonanywhere.com';

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

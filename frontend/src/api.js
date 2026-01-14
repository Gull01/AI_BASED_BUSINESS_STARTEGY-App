import axios from 'axios';

// Use the public backend URL
const API_URL = 'https://gis-business-api.loca.lt';

export const getRecommendations = async (query) => {
  const response = await axios.post(`${API_URL}/recommend`, {
    query: query,
  }, {
    headers: {
      'Bypass-Tunnel-Reminder': 'true'
    }
  });
  return response.data;
};

export const getMapInsight = async (latitude, longitude, businessType) => {
  const response = await axios.post(`${API_URL}/map-insight`, {
    latitude: latitude,
    longitude: longitude,
    business_type: businessType,
  }, {
    headers: {
      'Bypass-Tunnel-Reminder': 'true'
    }
  });
  return response.data;
};

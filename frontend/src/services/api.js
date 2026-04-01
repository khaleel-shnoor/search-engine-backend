import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const searchDocuments = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    throw error;
  }
};

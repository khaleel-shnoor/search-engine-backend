import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const searchDocuments = async (query, options = {}) => {
  if (!query) return { results: [], analytics: {} };
  try {
    const params = {
      q: query,
      date_from: options.dateFrom,
      date_to: options.dateTo,
      min_length: options.minLength,
      max_length: options.maxLength,
      category: options.category,
      domain: options.domain,
      sortBy: options.sortBy,
      page: options.page || 1,
      pageSize: options.pageSize || 10,
    };

    const response = await axios.get(`${API_BASE_URL}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const getSearchHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/search/history`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await axios.get(`${API_BASE_URL}/search/analytics`);
  return response.data;
};

export const getSuggestions = async (prefix) => {
  if (!prefix) return [];
  const response = await axios.get(`${API_BASE_URL}/search/suggestions`, {
    params: { q: prefix },
  });
  return response.data.suggestions;
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

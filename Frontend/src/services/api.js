import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Create an Axios instance with default config
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for API calls
 * - Adds Authorization header with JWT token if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 * - Handles token expiration
 * - Standardizes error responses
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if the error is due to an expired token
      const isExpiredToken = 
        error.response.data && 
        (error.response.data.message === 'Token expired' || 
         error.response.data.message === 'Not authorized to access this route');
      
      if (isExpiredToken) {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Redirect to login page
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

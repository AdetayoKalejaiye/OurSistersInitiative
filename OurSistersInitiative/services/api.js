// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const api = axios.create({
  baseURL: 'http://YOUR_IP_ADDRESS:5000/api', // Replace with your local network IP
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await axios.post('http://YOUR_IP_ADDRESS:5000/api/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    const { access_token } = response.data;

    // Store the new tokens
    await AsyncStorage.setItem('accessToken', access_token);
    
    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Handle refresh token failure (e.g., logout user)
    throw error;
  }
};

// Create a function to initialize interceptors
const initializeInterceptors = (router) => {
  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          router.replace('/login');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

// A custom hook to set up API interceptors
export const useApiSetup = () => {
  const router = useRouter();
  useEffect(() => {
    initializeInterceptors(router);
  }, [router]);
};

export default api;

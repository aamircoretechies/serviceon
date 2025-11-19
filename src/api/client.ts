/**
 * API Client
 * 
 * Configured Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { getAuth } from '@/auth/_helpers';
import { ApiErrorResponse } from './types';
import { toast } from 'sonner';

/**
 * Create Axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  });

  /**
   * Request Interceptor
   * Adds authentication token to requests
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const auth = getAuth();

      // Add authorization header if token exists
      // Use bearer_token if available, otherwise fall back to access_token
      const token = auth?.bearer_token || auth?.access_token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // If data is FormData, remove Content-Type header so axios can set it automatically
      // with the correct boundary for multipart/form-data
      if (config.data instanceof FormData && config.headers) {
        delete config.headers['Content-Type'];
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * Handles errors globally and token refresh
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Return successful responses as-is
      return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear auth and redirect to login
        // This will be handled by the auth context
        if (typeof window !== 'undefined') {
          // Remove auth from localStorage
          const { removeAuth } = await import('@/auth/_helpers');
          removeAuth();
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action');
        return Promise.reject(error);
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        toast.error('Resource not found');
        return Promise.reject(error);
      }

      // Handle 422 Validation Error
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Validation failed';
        
        // Show validation errors
        if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          toast.error(errorMessages || errorMessage);
        } else {
          toast.error(errorMessage);
        }
        
        return Promise.reject(error);
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
        return Promise.reject(error);
      }

      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your connection.');
        return Promise.reject(error);
      }

      // Handle other errors
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Default API client instance
 * Use this for all API calls
 */
export const apiClient = createApiClient();

/**
 * Export the create function for creating custom instances if needed
 */
export { createApiClient };


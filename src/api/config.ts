/**
 * API Configuration
 * 
 * Centralized configuration for API base URL and settings
 * Supports different environments: development, testing, staging, production
 */

/**
 * Environment types
 */
export type Environment = 'development' | 'testing' | 'staging' | 'production';

/**
 * Get current environment from environment variables
 */
export const getEnvironment = (): Environment => {
  const env = import.meta.env.MODE || import.meta.env.VITE_APP_ENV || 'development';
  
  if (env === 'production' || env === 'prod') return 'production';
  if (env === 'staging' || env === 'stage') return 'staging';
  if (env === 'testing' || env === 'test') return 'testing';
  
  return 'development';
};

/**
 * API Base URLs for different environments
 * You can override these with environment variables
 */
const API_BASE_URLS: Record<Environment, string> = {
  development: import.meta.env.VITE_APP_API_URL_DEV || 'https://jaap.live/service-on-apis',
  testing: import.meta.env.VITE_APP_API_URL_TEST || 'https://jaap.live/service-on-apis',
  staging: import.meta.env.VITE_APP_API_URL_STAGING || 'https://jaap.live/service-on-apis',
  production: import.meta.env.VITE_APP_API_URL_PROD || 'https://jaap.live/service-on-apis',
};

/**
 * Get API base URL based on current environment
 * Priority:
 * 1. Environment-specific variable (VITE_APP_API_URL_DEV, VITE_APP_API_URL_STAGING, etc.)
 * 2. Generic variable (VITE_APP_API_URL)
 * 3. Default for current environment
 */
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();
  
  // First, check for generic API URL (highest priority)
  const genericApiUrl = import.meta.env.VITE_APP_API_URL;
  if (genericApiUrl) {
    return genericApiUrl;
  }
  
  // Then, use environment-specific URL
  const envApiUrl = API_BASE_URLS[env];
  
  if (!envApiUrl) {
    console.warn(`API URL not configured for environment: ${env}. Using development URL.`);
    return API_BASE_URLS.development;
  }
  
  return envApiUrl;
};

/**
 * API Configuration Constants
 */
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENVIRONMENT: getEnvironment(),
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/**
 * API Version (if your backend uses versioning)
 * Set to empty string or null if not using versioning
 */
export const API_VERSION = '';

/**
 * Full API URL with version (if needed)
 * Example: http://localhost:8000/api/v1
 * If API_VERSION is empty, returns BASE_URL without version
 */
export const API_URL = API_VERSION 
  ? `${API_CONFIG.BASE_URL}/${API_VERSION}` 
  : API_CONFIG.BASE_URL;

/**
 * Helper function to check if we're in production
 */
export const isProduction = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'production';
};

/**
 * Helper function to check if we're in development
 */
export const isDevelopment = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'development';
};

/**
 * Helper function to check if we're in staging
 */
export const isStaging = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'staging';
};

/**
 * Helper function to check if we're in testing
 */
export const isTesting = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'testing';
};

/**
 * Images Base URL
 * Base URL for serving images (logos, avatars, etc.)
 */
export const getImagesBaseUrl = (): string => {
  return import.meta.env.VITE_APP_IMAGES_BASE_URL || 'https://jaap.live/serviceon-images';
};

export const IMAGES_BASE_URL = getImagesBaseUrl();


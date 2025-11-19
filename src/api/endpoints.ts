/**
 * API Endpoints
 * 
 * Centralized endpoint definitions for all API routes
 * Endpoints will be added incrementally as we integrate each feature
 */

import { API_URL } from './config';

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/users/login`,
  REGISTER: `${API_URL}/register`,
  LOGOUT: `${API_URL}/logout`,
  FORGOT_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,
  REFRESH_TOKEN: `${API_URL}/refresh-token`,
  VERIFY_EMAIL: `${API_URL}/verify-email`,
  GET_USER: `${API_URL}/dashboard/get`,
  UPDATE_PROFILE: `${API_URL}/user/profile`,
  CHANGE_PASSWORD: `${API_URL}/user/change-password`,
} as const;

/**
 * Export all endpoints for easy access
 * Additional endpoints will be added here as we integrate features
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  // Additional endpoints will be added here incrementally
} as const;


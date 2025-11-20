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
 * Timezone Endpoints
 */
export const TIMEZONE_ENDPOINTS = {
  GET_ALL: `${API_URL}/time-zones/get-all`,
} as const;

/**
 * Garage Endpoints
 */
export const GARAGE_ENDPOINTS = {
  CREATE: `${API_URL}/garage/create`,
  GET_ALL: `${API_URL}/garage/get-all`,
  UPDATE: `${API_URL}/garage/update`,
  DELETE: `${API_URL}/garage/delete`,
} as const;

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  DIRECT_REGISTRATION: `${API_URL}/users/direct-registration`,
  GET_ALL: `${API_URL}/users/get-all`,
  UPDATE_PROFILE: `${API_URL}/users/update-profile`,
  TOGGLE_USER_STATUS: `${API_URL}/users/toggle-user-status`,
  DELETE_ACCOUNT: `${API_URL}/users/delete-account`,
} as const;

/**
 * Job Type Endpoints
 */
export const JOB_TYPE_ENDPOINTS = {
  GET_ALL: `${API_URL}/job-types/get-all`,
} as const;

/**
 * Service Type Endpoints
 */
export const SERVICE_TYPE_ENDPOINTS = {
  GET_ALL: `${API_URL}/service-types/get-all`,
} as const;

/**
 * Export all endpoints for easy access
 * Additional endpoints will be added here as we integrate features
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  TIMEZONE: TIMEZONE_ENDPOINTS,
  GARAGE: GARAGE_ENDPOINTS,
  USER: USER_ENDPOINTS,
  JOB_TYPE: JOB_TYPE_ENDPOINTS,
  SERVICE_TYPE: SERVICE_TYPE_ENDPOINTS,
  // Additional endpoints will be added here incrementally
} as const;


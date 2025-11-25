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
  RESET_PASSWORD_REQUEST: `${API_URL}/users/reset-password-request`,
  RESET_PASSWORD_OTP: `${API_URL}/users/reset-password-otp`,
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
  GET_PROFILE: `${API_URL}/users/profile`,
  RESET_PASSWORD_OLD: `${API_URL}/users/reset-password-old`,
  LOGOUT: `${API_URL}/users/logout`,
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
 * Job Endpoints
 */
export const JOB_ENDPOINTS = {
  CREATE: `${API_URL}/jobs/create`,
  GET_ALL: `${API_URL}/jobs/get-all`,
  START_TIMER: `${API_URL}/jobs/start-timer`,
  STOP_TIMER: `${API_URL}/jobs/stop-timer`,
  UPDATE_STATUS: `${API_URL}/jobs/update-status`,
  UPDATE: `${API_URL}/jobs/update`,
  DELETE: `${API_URL}/jobs/delete`,
} as const;

/**
 * Brand Settings Endpoints
 */
export const BRAND_SETTINGS_ENDPOINTS = {
  GET: `${API_URL}/brand-settings/get`,
  CREATE_OR_UPDATE: `${API_URL}/brand-settings/create-or-update`,
} as const;

/**
 * Labor Category Endpoints
 */
export const LABOR_CATEGORY_ENDPOINTS = {
  GET_ALL: `${API_URL}/labor-category/get-all`,
} as const;

/**
 * Labor Rates Endpoints
 */
export const LABOR_RATES_ENDPOINTS = {
  CREATE: `${API_URL}/labor-rates/create`,
  GET_ALL: `${API_URL}/labor-rates/get-all`,
} as const;

/**
 * Intake Checklist Endpoints
 */
export const INTAKE_CHECKLIST_ENDPOINTS = {
  CREATE: `${API_URL}/intake-checklist/create`,
  GET_ALL: `${API_URL}/intake-checklist/get-all`,
  UPDATE: `${API_URL}/intake-checklist/update`,
  DELETE: `${API_URL}/intake-checklist/delete`,
  SET_ARRANGE_ORDER: `${API_URL}/intake-checklist/set-arrange-order`,
} as const;

/**
 * Vehicle History Endpoints
 */
export const VEHICLE_HISTORY_ENDPOINTS = {
  CREATE: `${API_URL}/vehicle-history/create`,
  GET_ALL: `${API_URL}/vehicle-history/get-all`,
  UPDATE: `${API_URL}/vehicle-history/update`,
  DELETE: `${API_URL}/vehicle-history/delete`,
} as const;

/**
 * PDF Configuration Endpoints
 */
export const PDF_CONFIGURATION_ENDPOINTS = {
  GET: `${API_URL}/pdf-configuration/get`,
  CREATE_OR_UPDATE: `${API_URL}/pdf-configuration/create-or-update`,
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
  JOB: JOB_ENDPOINTS,
  BRAND_SETTINGS: BRAND_SETTINGS_ENDPOINTS,
  LABOR_CATEGORY: LABOR_CATEGORY_ENDPOINTS,
  LABOR_RATES: LABOR_RATES_ENDPOINTS,
  INTAKE_CHECKLIST: INTAKE_CHECKLIST_ENDPOINTS,
  VEHICLE_HISTORY: VEHICLE_HISTORY_ENDPOINTS,
  PDF_CONFIGURATION: PDF_CONFIGURATION_ENDPOINTS,
  // Additional endpoints will be added here incrementally
} as const;


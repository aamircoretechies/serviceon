/**
 * API Types
 * 
 * TypeScript types and interfaces for API requests and responses
 */

/**
 * Standard API Response Wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    from?: number;
    to?: number;
  };
  message?: string;
  status?: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  status?: number;
  error?: string;
}

/**
 * Request Parameters for List Endpoints
 */
export interface ListRequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: {
    [key: string]: any;
  };
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response
 * Actual API response structure
 */
export interface LoginResponse {
  user_role: number;
  user_status: number;
  bearer_token: string;
  user_id: number;
  message: string;
  status: number;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Forgot Password Request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Generic CRUD Types
 */
export interface CreateRequest<T = any> {
  [key: string]: any;
}

export interface UpdateRequest<T = any> {
  [key: string]: any;
}

/**
 * File Upload Request
 */
export interface FileUploadRequest {
  file: File;
  folder?: string;
  tags?: string[];
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  id: string | number;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}


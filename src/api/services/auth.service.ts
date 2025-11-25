/**
 * Authentication Service
 * 
 * Service layer for authentication-related API calls
 */

import { apiClient } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordRequestRequest,
  ResetPasswordRequestResponse,
  ResetPasswordOtpRequest,
  ResetPasswordOtpResponse,
  ChangePasswordRequest,
  ApiResponse,
} from '../types';
import type { UserModel } from '@/auth/_models';

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Login user
   * Note: This endpoint doesn't require Bearer token
   * API expects form data (application/x-www-form-urlencoded)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use axios directly without the apiClient to avoid auth interceptor
    const axios = (await import('axios')).default;
    const { AUTH_ENDPOINTS } = await import('../endpoints');

    // Convert to URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await axios.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  }

  /**
   * Request password reset link
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  }

  /**
   * Request password reset OTP
   * Bearer token not required
   * POST request with email
   */
  async resetPasswordRequest(data: ResetPasswordRequestRequest): Promise<ResetPasswordRequestResponse> {
    // Use axios directly without the apiClient to avoid auth interceptor
    const axios = (await import('axios')).default;
    const { AUTH_ENDPOINTS } = await import('../endpoints');

    // Convert to URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('email', data.email);

    const response = await axios.post<ResetPasswordRequestResponse>(
      AUTH_ENDPOINTS.RESET_PASSWORD_REQUEST,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Reset password with OTP
   * Bearer token not required
   * POST request with email, otp, and new_password
   */
  async resetPasswordOtp(data: ResetPasswordOtpRequest): Promise<ResetPasswordOtpResponse> {
    // Use axios directly without the apiClient to avoid auth interceptor
    const axios = (await import('axios')).default;
    const { AUTH_ENDPOINTS } = await import('../endpoints');

    // Convert to URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('email', data.email);
    formData.append('otp', data.otp);
    formData.append('new_password', data.new_password);

    const response = await axios.post<ResetPasswordOtpResponse>(
      AUTH_ENDPOINTS.RESET_PASSWORD_OTP,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refresh_token: refreshToken }
    );
    return response.data.data;
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserModel> {
    const response = await apiClient.get<ApiResponse<UserModel>>(
      AUTH_ENDPOINTS.GET_USER
    );
    return response.data.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserModel>): Promise<UserModel> {
    const response = await apiClient.put<ApiResponse<UserModel>>(
      AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );
    return response.data.data;
  }
}

/**
 * Export singleton instance
 */
export const authService = new AuthService();

/**
 * Export class for testing purposes
 */
export { AuthService };


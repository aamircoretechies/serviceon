/**
 * User Service
 * 
 * Service layer for user-related API calls
 */

import { apiClient } from '../client';
import { USER_ENDPOINTS } from '../endpoints';
import type { 
  CreateUserRequest, 
  CreateUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
  ResetPasswordOldRequest,
  ResetPasswordOldResponse,
  LogoutResponse,
  ToggleUserStatusRequest,
  ToggleUserStatusResponse,
  DeleteUserAccountRequest,
  DeleteUserAccountResponse,
} from '../types';

/**
 * User Service Class
 */
class UserService {
  /**
   * Create a new user (Direct Registration)
   * Bearer token required
   * Uses form-data format
   */
  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
    // Convert to URL-encoded form data
    const formData = new URLSearchParams();
    
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('mobile_number', data.mobile_number);
    formData.append('password', data.password);
    formData.append('status', data.status.toString());
    formData.append('user_role', data.user_role.toString());
    formData.append('send_welcome_email', data.send_welcome_email.toString());
    formData.append('require_password_change', data.require_password_change.toString());
    formData.append('garage_ids', data.garage_ids);

    const response = await apiClient.post<CreateUserResponse>(
      USER_ENDPOINTS.DIRECT_REGISTRATION,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }

  /**
   * Get all users with pagination and filters
   * Bearer token required
   * Uses form-data format (as shown in Postman)
   */
  async getAll(params?: GetUsersRequest): Promise<GetUsersResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Always include page and size
    if (params?.page !== undefined) {
      formData.append('page', params.page.toString());
    } else {
      formData.append('page', '0');
    }
    
    if (params?.size !== undefined) {
      formData.append('size', params.size.toString());
    } else {
      formData.append('size', '10');
    }
    
    // Add search parameter (always send, even if empty)
    if (params?.search !== undefined) {
      formData.append('search', params.search);
    } else {
      formData.append('search', '');
    }
    
    // Add status parameter (only if provided)
    if (params?.status !== undefined && params.status !== null && params.status !== '') {
      formData.append('status', params.status.toString());
    }
    
    // Add user_role parameter (only if provided)
    if (params?.user_role !== undefined && params.user_role !== null && params.user_role !== '') {
      formData.append('user_role', params.user_role.toString());
    }

    const response = await apiClient.post<GetUsersResponse>(
      USER_ENDPOINTS.GET_ALL,
      formData
    );
    return response.data;
  }

  /**
   * Get user profile
   * Bearer token required
   * POST request with user_id
   */
  async getProfile(data: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('user_id', data.user_id.toString());

    const response = await apiClient.post<GetUserProfileResponse>(
      USER_ENDPOINTS.GET_PROFILE,
      formData
    );
    return response.data;
  }

  /**
   * Update user profile
   * Bearer token required
   * Uses form-data format for file upload support
   * All fields are required by the API
   */
  async updateProfile(data: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Always send user_id (required)
    formData.append('user_id', data.user_id.toString());
    
    // Always send first_name (required) - send empty string if not provided
    formData.append('first_name', data.first_name !== undefined ? data.first_name : '');
    
    // Always send last_name (required) - send empty string if not provided
    formData.append('last_name', data.last_name !== undefined ? data.last_name : '');
    
    // Always send mobile_number (required) - send empty string if not provided
    formData.append('mobile_number', data.mobile_number !== undefined ? data.mobile_number : '');
    
    // Always send address1 (required) - send empty string if not provided
    formData.append('address1', data.address1 !== undefined ? data.address1 : '');
    
    // Only append profile_image if provided (optional)
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }

    // Debug: Log FormData contents
    console.log('Update Profile FormData:');
    console.log('user_id:', data.user_id);
    console.log('first_name:', data.first_name || '');
    console.log('last_name:', data.last_name || '');
    console.log('mobile_number:', data.mobile_number || '');
    console.log('address1:', data.address1 || '');
    console.log('profile_image:', data.profile_image ? 'File provided' : 'No file');

    const response = await apiClient.post<UpdateUserProfileResponse>(
      USER_ENDPOINTS.UPDATE_PROFILE,
      formData
    );
    return response.data;
  }

  /**
   * Reset password with old password
   * Bearer token required
   * Uses form-data format
   */
  async resetPasswordOld(data: ResetPasswordOldRequest): Promise<ResetPasswordOldResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    formData.append('old_password', data.old_password);
    formData.append('new_password', data.new_password);

    const response = await apiClient.post<ResetPasswordOldResponse>(
      USER_ENDPOINTS.RESET_PASSWORD_OLD,
      formData
    );
    return response.data;
  }

  /**
   * Toggle user status (enable/disable)
   * Bearer token required
   * Uses form-data format
   */
  async toggleUserStatus(data: ToggleUserStatusRequest): Promise<ToggleUserStatusResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    formData.append('user_id', data.user_id.toString());
    formData.append('status', data.status.toString());

    const response = await apiClient.post<ToggleUserStatusResponse>(
      USER_ENDPOINTS.TOGGLE_USER_STATUS,
      formData
    );
    return response.data;
  }

  /**
   * Logout user
   * Bearer token required
   * POST request with no data
   */
  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>(
      USER_ENDPOINTS.LOGOUT,
      {}
    );
    return response.data;
  }

  /**
   * Delete user account
   * Bearer token required
   * Uses form-data format
   */
  async deleteAccount(data: DeleteUserAccountRequest): Promise<DeleteUserAccountResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    formData.append('user_id', data.user_id.toString());

    const response = await apiClient.post<DeleteUserAccountResponse>(
      USER_ENDPOINTS.DELETE_ACCOUNT,
      formData
    );
    return response.data;
  }
}

/**
 * Export singleton instance
 */
export const userService = new UserService();

/**
 * Export class for testing purposes
 */
export { UserService };


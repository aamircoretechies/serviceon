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
}

/**
 * Export singleton instance
 */
export const userService = new UserService();

/**
 * Export class for testing purposes
 */
export { UserService };


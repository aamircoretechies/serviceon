/**
 * Garage Service
 * 
 * Service layer for garage-related API calls
 */

import { apiClient } from '../client';
import { GARAGE_ENDPOINTS } from '../endpoints';
import type { 
  CreateGarageRequest, 
  CreateGarageResponse,
  GetGaragesRequest,
  GetGaragesResponse,
  UpdateGarageRequest,
  UpdateGarageResponse,
  DeleteGarageRequest,
  DeleteGarageResponse,
} from '../types';

/**
 * Garage Service Class
 */
class GarageService {
  /**
   * Create a new garage
   * Bearer token required
   * Uses form-data for file upload support
   */
  async create(data: CreateGarageRequest): Promise<CreateGarageResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    formData.append('garage_name', data.garage_name);
    formData.append('garage_phone_number', data.garage_phone_number);
    formData.append('garage_email_address', data.garage_email_address);
    formData.append('garage_description', data.garage_description);
    formData.append('garage_street_address', data.garage_street_address);
    formData.append('garage_city', data.garage_city);
    formData.append('garage_state', data.garage_state);
    formData.append('garage_zip_code', data.garage_zip_code);
    formData.append('time_zone_id', data.time_zone_id.toString());
    formData.append('status', data.status.toString());
    formData.append('garage_brand_color', data.garage_brand_color);
    
    // Only append logo if it exists
    if (data.garage_logo) {
      formData.append('garage_logo', data.garage_logo);
    }

    // The request interceptor will handle FormData and remove Content-Type header
    // so axios can automatically set multipart/form-data with the correct boundary
    const response = await apiClient.post<CreateGarageResponse>(
      GARAGE_ENDPOINTS.CREATE,
      formData
    );

    return response.data;
  }

  /**
   * Get all garages with pagination and filters
   * Bearer token required
   */
  async getAll(params?: GetGaragesRequest): Promise<GetGaragesResponse> {
    const response = await apiClient.post<GetGaragesResponse>(
      GARAGE_ENDPOINTS.GET_ALL,
      params || {}
    );
    return response.data;
  }

  /**
   * Update an existing garage
   * Bearer token required
   * Uses form-data for file upload support
   */
  async update(data: UpdateGarageRequest): Promise<UpdateGarageResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    formData.append('garage_id', data.garage_id.toString());
    formData.append('garage_name', data.garage_name);
    formData.append('garage_phone_number', data.garage_phone_number);
    formData.append('garage_email_address', data.garage_email_address);
    formData.append('garage_description', data.garage_description);
    formData.append('garage_street_address', data.garage_street_address);
    formData.append('garage_city', data.garage_city);
    formData.append('garage_state', data.garage_state);
    formData.append('garage_zip_code', data.garage_zip_code);
    formData.append('time_zone_id', data.time_zone_id.toString());
    formData.append('status', data.status.toString());
    formData.append('garage_brand_color', data.garage_brand_color);
    
    // Only append logo if it exists (for updates, logo is optional)
    if (data.garage_logo) {
      formData.append('garage_logo', data.garage_logo);
    }

    // The request interceptor will handle FormData and remove Content-Type header
    // so axios can automatically set multipart/form-data with the correct boundary
    const response = await apiClient.put<UpdateGarageResponse>(
      GARAGE_ENDPOINTS.UPDATE,
      formData
    );

    return response.data;
  }

  /**
   * Delete a garage
   * Bearer token required
   * API expects form-data format
   */
  async delete(data: DeleteGarageRequest): Promise<DeleteGarageResponse> {
    // Convert to URL-encoded form data (similar to login API)
    const formData = new URLSearchParams();
    formData.append('garage_id', data.garage_id.toString());

    const response = await apiClient.delete<DeleteGarageResponse>(
      GARAGE_ENDPOINTS.DELETE,
      {
        data: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }
}

/**
 * Export singleton instance
 */
export const garageService = new GarageService();

/**
 * Export class for testing purposes
 */
export { GarageService };


/**
 * Service Type Service
 * 
 * Service layer for service type-related API calls
 */

import { apiClient } from '../client';
import { SERVICE_TYPE_ENDPOINTS } from '../endpoints';
import type { GetServiceTypesResponse, ServiceType } from '../types';

/**
 * Service Type Service Class
 */
class ServiceTypeService {
  /**
   * Get all service types
   * Bearer token required
   */
  async getAll(): Promise<ServiceType[]> {
    const response = await apiClient.post<GetServiceTypesResponse>(
      SERVICE_TYPE_ENDPOINTS.GET_ALL,
      {} // No request data required
    );
    
    // Return service types sorted by service_type_name
    return response.data.data.sort((a, b) => 
      a.service_type_name.localeCompare(b.service_type_name)
    );
  }
}

/**
 * Export singleton instance
 */
export const serviceTypeService = new ServiceTypeService();

/**
 * Export class for testing purposes
 */
export { ServiceTypeService };


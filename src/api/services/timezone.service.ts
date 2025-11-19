/**
 * Timezone Service
 * 
 * Service layer for timezone-related API calls
 */

import { apiClient } from '../client';
import { TIMEZONE_ENDPOINTS } from '../endpoints';
import type { TimezonesResponse, Timezone } from '../types';

/**
 * Timezone Service Class
 */
class TimezoneService {
  /**
   * Get all timezones
   * Bearer token required
   */
  async getAll(): Promise<Timezone[]> {
    const response = await apiClient.post<TimezonesResponse>(
      TIMEZONE_ENDPOINTS.GET_ALL,
      {} // No request data required
    );
    
    // Return only active timezones, sorted by timezone_name
    return response.data.data
      .filter(tz => tz.is_active === 1)
      .sort((a, b) => a.timezone_name.localeCompare(b.timezone_name));
  }
}

/**
 * Export singleton instance
 */
export const timezoneService = new TimezoneService();

/**
 * Export class for testing purposes
 */
export { TimezoneService };


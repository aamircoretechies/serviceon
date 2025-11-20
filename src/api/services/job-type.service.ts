/**
 * Job Type Service
 * 
 * Service layer for job type-related API calls
 */

import { apiClient } from '../client';
import { JOB_TYPE_ENDPOINTS } from '../endpoints';
import type { GetJobTypesResponse, JobType } from '../types';

/**
 * Job Type Service Class
 */
class JobTypeService {
  /**
   * Get all job types
   * Bearer token required
   */
  async getAll(): Promise<JobType[]> {
    const response = await apiClient.post<GetJobTypesResponse>(
      JOB_TYPE_ENDPOINTS.GET_ALL,
      {} // No request data required
    );
    
    // Return job types sorted by job_type_name
    return response.data.data.sort((a, b) => 
      a.job_type_name.localeCompare(b.job_type_name)
    );
  }
}

/**
 * Export singleton instance
 */
export const jobTypeService = new JobTypeService();

/**
 * Export class for testing purposes
 */
export { JobTypeService };


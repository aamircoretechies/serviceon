/**
 * Job Service
 * 
 * Service layer for job-related API calls
 */

import { apiClient } from '../client';
import { JOB_ENDPOINTS } from '../endpoints';
import type { CreateJobRequest, CreateJobResponse, GetJobsRequest, GetJobsResponse } from '../types';

/**
 * Job Service Class
 */
class JobService {
  /**
   * Create a new job
   * Bearer token required
   * Uses form-data format (multipart/form-data)
   */
  async create(data: CreateJobRequest): Promise<CreateJobResponse> {
    // Create FormData for multipart/form-data request
    // Send ALL fields as required by Spring Boot @RequestParam
    const formData = new FormData();
    
    // Vehicle information - always send
    formData.append('vehicle_make', data.vehicle_make || '');
    formData.append('vehicle_model', data.vehicle_model || '');
    formData.append('vehicle_year', data.vehicle_year || '');
    formData.append('vehicle_license_plate', data.vehicle_license_plate || '');
    formData.append('vehicle_vin', data.vehicle_vin || '');
    formData.append('vehicle_mileage', data.vehicle_mileage || '');
    
    // Customer information - always send
    formData.append('customer_name', data.customer_name || '');
    formData.append('customer_phone_number', data.customer_phone_number || '');
    formData.append('customer_email_address', data.customer_email_address || '');
    
    // Job information - always send
    formData.append('job_type_id', data.job_type_id?.toString() || '');
    formData.append('job_priority', data.job_priority?.toString() || '');
    formData.append('job_estimated_hours', data.job_estimated_hours || '');
    formData.append('job_estimated_cost', data.job_estimated_cost || '');
    formData.append('job_description', data.job_description || '');
    formData.append('job_service_type', data.job_service_type?.toString() || '');
    
    // Assignment - always send
    formData.append('garage_id', data.garage_id?.toString() || '');
    formData.append('mechanic_id', data.mechanic_id?.toString() || '');
    
    // Status and additional fields - always send
    formData.append('status', data.status?.toString() || '1');
    formData.append('timer', data.timer || '00:00:00');
    formData.append('extra_data', data.extra_data || '');
    
    // Parts data - always send arrays (even if empty)
    const partNames = data.part_name || [];
    const partCounts = data.part_count || [];
    const partNumbers = data.part_number || [];
    const partDescriptions = data.part_description || [];
    const partCostTotals = data.part_cost_total || [];
    
    // Append each part field individually
    partNames.forEach(name => {
      formData.append('part_name', name || '');
    });
    partCounts.forEach(count => {
      formData.append('part_count', count?.toString() || '0');
    });
    partNumbers.forEach(number => {
      formData.append('part_number', number || '');
    });
    partDescriptions.forEach(description => {
      formData.append('part_description', description || '');
    });
    partCostTotals.forEach(cost => {
      formData.append('part_cost_total', cost || '0');
    });

    const response = await apiClient.post<CreateJobResponse>(
      JOB_ENDPOINTS.CREATE,
      formData
    );
    return response.data;
  }

  /**
   * Get all jobs with filters and pagination
   * Bearer token required
   * POST request with optional filters
   */
  async getAll(params?: GetJobsRequest): Promise<GetJobsResponse> {
    const requestData: GetJobsRequest = {
      page_number: params?.page_number,
      page_size: params?.page_size,
      search: params?.search,
      garage_id: params?.garage_id,
      mechanic_id: params?.mechanic_id,
      status: params?.status,
    };

    const response = await apiClient.post<GetJobsResponse>(
      JOB_ENDPOINTS.GET_ALL,
      requestData
    );
    return response.data;
  }
}

/**
 * Export singleton instance
 */
export const jobService = new JobService();

/**
 * Export class for testing purposes
 */
export { JobService };


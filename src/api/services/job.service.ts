/**
 * Job Service
 * 
 * Service layer for job-related API calls
 */

import { apiClient } from '../client';
import { JOB_ENDPOINTS } from '../endpoints';
import type { 
  CreateJobRequest, 
  CreateJobResponse, 
  GetJobsRequest, 
  GetJobsResponse,
  StartTimerRequest,
  StartTimerResponse,
  StopTimerRequest,
  StopTimerResponse,
  UpdateJobStatusRequest,
  UpdateJobStatusResponse,
  DeleteJobRequest,
  DeleteJobResponse,
  UpdateJobRequest,
  UpdateJobResponse,
} from '../types';

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
    // Always send job_service_type - send value if provided, otherwise empty string
    const jobServiceTypeValue = data.job_service_type !== undefined && data.job_service_type !== null 
      ? data.job_service_type.toString() 
      : '';
    console.log('Appending job_service_type to FormData:', jobServiceTypeValue, '(from:', data.job_service_type, ')');
    formData.append('job_service_type', jobServiceTypeValue);
    
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
   * Uses form-data format (multipart/form-data)
   */
  async getAll(params?: GetJobsRequest): Promise<GetJobsResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Always include page_number and page_size
    if (params?.page_number !== undefined) {
      formData.append('page_number', params.page_number.toString());
    } else {
      formData.append('page_number', '0');
    }
    
    if (params?.page_size !== undefined) {
      formData.append('page_size', params.page_size.toString());
    } else {
      formData.append('page_size', '10');
    }
    
    // Add search parameter (only if provided and not empty)
    if (params?.search !== undefined && params.search !== null && params.search !== '') {
      formData.append('search', params.search);
    }
    
    // Add garage_id parameter (only if provided)
    if (params?.garage_id !== undefined && params.garage_id !== null) {
      formData.append('garage_id', params.garage_id.toString());
    }
    
    // Add mechanic_id parameter (only if provided)
    if (params?.mechanic_id !== undefined && params.mechanic_id !== null) {
      formData.append('mechanic_id', params.mechanic_id.toString());
    }
    
    // Add status parameter (only if provided)
    if (params?.status !== undefined && params.status !== null) {
      formData.append('status', params.status.toString());
    }

    const response = await apiClient.post<GetJobsResponse>(
      JOB_ENDPOINTS.GET_ALL,
      formData
    );
    return response.data;
  }

  /**
   * Start timer for a job
   * Bearer token required
   * POST request with job_id
   * Uses form-data format (multipart/form-data)
   */
  async startTimer(data: StartTimerRequest): Promise<StartTimerResponse> {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());

    const response = await apiClient.post<StartTimerResponse>(
      JOB_ENDPOINTS.START_TIMER,
      formData
    );
    return response.data;
  }

  /**
   * Stop timer for a job
   * Bearer token required
   * POST request with job_id
   * Uses form-data format (multipart/form-data)
   */
  async stopTimer(data: StopTimerRequest): Promise<StopTimerResponse> {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());

    const response = await apiClient.post<StopTimerResponse>(
      JOB_ENDPOINTS.STOP_TIMER,
      formData
    );
    return response.data;
  }

  /**
   * Update job status
   * Bearer token required
   * POST request with job_id and status
   * Uses form-data format (multipart/form-data)
   */
  async updateStatus(data: UpdateJobStatusRequest): Promise<UpdateJobStatusResponse> {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());
    formData.append('status', data.status.toString());

    const response = await apiClient.post<UpdateJobStatusResponse>(
      JOB_ENDPOINTS.UPDATE_STATUS,
      formData
    );
    return response.data;
  }

  /**
   * Delete a job
   * Bearer token required
   * DELETE request with job_id
   * Uses form-data format (multipart/form-data)
   */
  async delete(data: DeleteJobRequest): Promise<DeleteJobResponse> {
    const formData = new FormData();
    formData.append('job_id', data.job_id.toString());

    const response = await apiClient.delete<DeleteJobResponse>(
      JOB_ENDPOINTS.DELETE,
      { data: formData }
    );
    return response.data;
  }

  /**
   * Update a job
   * Bearer token required
   * PUT request with all job data + job_id
   * Uses form-data format (multipart/form-data)
   */
  async update(data: UpdateJobRequest): Promise<UpdateJobResponse> {
    const formData = new FormData();
    
    // Always include job_id (required)
    formData.append('job_id', data.job_id.toString());
    
    // Vehicle information - send if provided
    if (data.vehicle_make !== undefined) formData.append('vehicle_make', data.vehicle_make || '');
    if (data.vehicle_model !== undefined) formData.append('vehicle_model', data.vehicle_model || '');
    if (data.vehicle_year !== undefined) formData.append('vehicle_year', data.vehicle_year || '');
    if (data.vehicle_license_plate !== undefined) formData.append('vehicle_license_plate', data.vehicle_license_plate || '');
    if (data.vehicle_vin !== undefined) formData.append('vehicle_vin', data.vehicle_vin || '');
    if (data.vehicle_mileage !== undefined) formData.append('vehicle_mileage', data.vehicle_mileage || '');
    
    // Customer information - send if provided
    if (data.customer_name !== undefined) formData.append('customer_name', data.customer_name || '');
    if (data.customer_phone_number !== undefined) formData.append('customer_phone_number', data.customer_phone_number || '');
    if (data.customer_email_address !== undefined) formData.append('customer_email_address', data.customer_email_address || '');
    
    // Job information - send if provided
    if (data.job_type_id !== undefined) formData.append('job_type_id', data.job_type_id?.toString() || '');
    if (data.job_priority !== undefined) formData.append('job_priority', data.job_priority?.toString() || '');
    if (data.job_estimated_hours !== undefined) formData.append('job_estimated_hours', data.job_estimated_hours || '');
    if (data.job_estimated_cost !== undefined) formData.append('job_estimated_cost', data.job_estimated_cost || '');
    if (data.job_description !== undefined) formData.append('job_description', data.job_description || '');
    if (data.job_service_type !== undefined) {
      formData.append('job_service_type', data.job_service_type?.toString() || '');
    }
    
    // Assignment - send if provided
    if (data.garage_id !== undefined) formData.append('garage_id', data.garage_id?.toString() || '');
    if (data.mechanic_id !== undefined) formData.append('mechanic_id', data.mechanic_id?.toString() || '');
    
    // Status and additional fields - send if provided
    if (data.status !== undefined) formData.append('status', data.status?.toString() || '');
    if (data.timer !== undefined) formData.append('timer', data.timer || '');
    if (data.extra_data !== undefined) formData.append('extra_data', data.extra_data || '');
    
    // Parts data - send if provided
    if (data.part_name && data.part_name.length > 0) {
      data.part_name.forEach(name => {
        formData.append('part_name', name || '');
      });
    }
    if (data.part_count && data.part_count.length > 0) {
      data.part_count.forEach(count => {
        formData.append('part_count', count?.toString() || '0');
      });
    }
    if (data.part_number && data.part_number.length > 0) {
      data.part_number.forEach(number => {
        formData.append('part_number', number || '');
      });
    }
    if (data.part_description && data.part_description.length > 0) {
      data.part_description.forEach(description => {
        formData.append('part_description', description || '');
      });
    }
    if (data.part_cost_total && data.part_cost_total.length > 0) {
      data.part_cost_total.forEach(cost => {
        formData.append('part_cost_total', cost || '0');
      });
    }

    const response = await apiClient.put<UpdateJobResponse>(
      JOB_ENDPOINTS.UPDATE,
      formData
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


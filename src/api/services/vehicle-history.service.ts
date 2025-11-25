/**
 * Vehicle History Service
 * 
 * Service layer for vehicle history-related API calls
 */

import { apiClient } from '../client';
import { VEHICLE_HISTORY_ENDPOINTS } from '../endpoints';
import type { 
  CreateVehicleHistoryRequest,
  CreateVehicleHistoryResponse,
  GetVehicleHistoryRequest,
  GetVehicleHistoryResponse,
  UpdateVehicleHistoryRequest,
  UpdateVehicleHistoryResponse,
  DeleteVehicleHistoryRequest,
  DeleteVehicleHistoryResponse
} from '../types';

/**
 * Vehicle History Service Class
 */
class VehicleHistoryService {
  /**
   * Create a new vehicle history
   * Bearer token required
   * Uses form-data for file uploads
   */
  async create(data: CreateVehicleHistoryRequest): Promise<CreateVehicleHistoryResponse> {
    const formData = new FormData();
    
    if (data.vehicle_id !== undefined) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.vehicle_number) {
      formData.append('vehicle_number', data.vehicle_number);
    }
    if (data.vin_number) {
      formData.append('vin_number', data.vin_number);
    }
    if (data.make_model) {
      formData.append('make_model', data.make_model);
    }
    if (data.make_year) {
      formData.append('make_year', data.make_year);
    }
    if (data.vehicle_color) {
      formData.append('vehicle_color', data.vehicle_color);
    }
    if (data.vehicle_mileage) {
      formData.append('vehicle_mileage', data.vehicle_mileage);
    }
    formData.append('user_id', data.user_id.toString());
    formData.append('status', (data.status || 1).toString());
    formData.append('total_jobs', (data.total_jobs || 0).toString());
    formData.append('total_notest', (data.total_notest || 0).toString());
    
    if (data.last_service) {
      formData.append('last_service', data.last_service);
    }
    if (data.next_service_schedule) {
      formData.append('next_service_schedule', data.next_service_schedule);
    }
    if (data.job_summary) {
      formData.append('job_summary', data.job_summary);
    }
    if (data.admin_notes) {
      formData.append('admin_notes', data.admin_notes);
    }
    
    // Append multiple photos
    if (data.vehicle_photos && data.vehicle_photos.length > 0) {
      data.vehicle_photos.forEach((photo) => {
        formData.append('vehicle_photos', photo);
      });
    }

    const response = await apiClient.post<CreateVehicleHistoryResponse>(
      VEHICLE_HISTORY_ENDPOINTS.CREATE,
      formData
    );
    return response.data;
  }

  /**
   * Get all vehicle history with pagination and filters
   * Bearer token required
   */
  async getAll(params?: GetVehicleHistoryRequest): Promise<GetVehicleHistoryResponse> {
    const formData = new FormData();
    
    formData.append('page', (params?.page || 0).toString());
    formData.append('size', (params?.size || 10).toString());
    
    if (params?.vehicle_id) {
      formData.append('vehicle_id', params.vehicle_id.toString());
    }
    if (params?.user_id) {
      formData.append('user_id', params.user_id.toString());
    }
    // Always send search parameter (even if empty)
    if (params?.search !== undefined) {
      formData.append('search', params.search);
    } else {
      formData.append('search', '');
    }
    if (params?.status !== undefined) {
      formData.append('status', params.status.toString());
    }

    const response = await apiClient.post<GetVehicleHistoryResponse>(
      VEHICLE_HISTORY_ENDPOINTS.GET_ALL,
      formData
    );
    return response.data;
  }

  /**
   * Update a vehicle history
   * Bearer token required
   * Uses form-data for file uploads
   */
  async update(data: UpdateVehicleHistoryRequest): Promise<UpdateVehicleHistoryResponse> {
    const formData = new FormData();
    
    formData.append('vehicle_history_id', data.vehicle_history_id.toString());
    
    if (data.vehicle_id !== undefined) {
      formData.append('vehicle_id', data.vehicle_id.toString());
    }
    if (data.vehicle_number !== undefined) {
      formData.append('vehicle_number', data.vehicle_number || '');
    }
    if (data.vin_number !== undefined) {
      formData.append('vin_number', data.vin_number || '');
    }
    if (data.make_model !== undefined) {
      formData.append('make_model', data.make_model || '');
    }
    if (data.make_year !== undefined) {
      formData.append('make_year', data.make_year || '');
    }
    if (data.vehicle_color !== undefined) {
      formData.append('vehicle_color', data.vehicle_color || '');
    }
    if (data.vehicle_mileage !== undefined) {
      formData.append('vehicle_mileage', data.vehicle_mileage || '');
    }
    if (data.user_id !== undefined) {
      formData.append('user_id', data.user_id.toString());
    }
    if (data.status !== undefined) {
      formData.append('status', data.status.toString());
    }
    if (data.total_jobs !== undefined) {
      formData.append('total_jobs', data.total_jobs.toString());
    }
    if (data.total_notest !== undefined) {
      formData.append('total_notest', data.total_notest.toString());
    }
    if (data.last_service !== undefined) {
      formData.append('last_service', data.last_service || '');
    }
    if (data.next_service_schedule !== undefined) {
      formData.append('next_service_schedule', data.next_service_schedule || '');
    }
    if (data.job_summary !== undefined) {
      formData.append('job_summary', data.job_summary || '');
    }
    if (data.admin_notes !== undefined) {
      formData.append('admin_notes', data.admin_notes || '');
    }
    
    // Append multiple photos
    if (data.vehicle_photos && data.vehicle_photos.length > 0) {
      data.vehicle_photos.forEach((photo) => {
        formData.append('vehicle_photos', photo);
      });
    }

    const response = await apiClient.put<UpdateVehicleHistoryResponse>(
      VEHICLE_HISTORY_ENDPOINTS.UPDATE,
      formData
    );
    return response.data;
  }

  /**
   * Delete a vehicle history
   * Bearer token required
   * Uses form-data
   */
  async delete(data: DeleteVehicleHistoryRequest): Promise<DeleteVehicleHistoryResponse> {
    const formData = new FormData();
    formData.append('vehicle_history_id', data.vehicle_history_id.toString());

    const response = await apiClient.delete<DeleteVehicleHistoryResponse>(
      VEHICLE_HISTORY_ENDPOINTS.DELETE,
      { data: formData }
    );
    return response.data;
  }
}

export const vehicleHistoryService = new VehicleHistoryService();


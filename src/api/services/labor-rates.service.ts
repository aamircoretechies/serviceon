/**
 * Labor Rates Service
 * 
 * Service layer for labor rates-related API calls
 */

import { apiClient } from '../client';
import { LABOR_RATES_ENDPOINTS } from '../endpoints';
import type { 
  CreateLaborRateRequest,
  CreateLaborRateResponse,
  GetLaborRatesResponse,
  LaborRate
} from '../types';

/**
 * Labor Rates Service Class
 */
class LaborRatesService {
  /**
   * Create a new labor rate
   * Bearer token required
   * Uses form-data
   */
  async create(data: CreateLaborRateRequest): Promise<CreateLaborRateResponse> {
    const formData = new FormData();
    
    formData.append('standard_rate', data.standard_rate.toString());
    formData.append('overtime_rate', data.overtime_rate.toString());
    formData.append('weekend_rate', data.weekend_rate.toString());
    formData.append('holiday_rate', data.holiday_rate.toString());
    formData.append('currency', data.currency);
    formData.append('billing_unit', data.billing_unit);
    formData.append('labor_category_id', data.labor_category_id.toString());
    formData.append('garage_id', data.garage_id.toString());
    
    if (data.notes) {
      formData.append('notes', data.notes);
    } else {
      formData.append('notes', '');
    }

    const response = await apiClient.post<CreateLaborRateResponse>(
      LABOR_RATES_ENDPOINTS.CREATE,
      formData
    );
    return response.data;
  }

  /**
   * Get all labor rates
   * Bearer token required
   */
  async getAll(): Promise<LaborRate[]> {
    const response = await apiClient.post<GetLaborRatesResponse>(
      LABOR_RATES_ENDPOINTS.GET_ALL,
      {}
    );
    return response.data.data;
  }
}

export const laborRatesService = new LaborRatesService();


/**
 * Labor Category Service
 * 
 * Service layer for labor category-related API calls
 */

import { apiClient } from '../client';
import { LABOR_CATEGORY_ENDPOINTS } from '../endpoints';
import type { 
  GetLaborCategoriesResponse,
  LaborCategory
} from '../types';

/**
 * Labor Category Service Class
 */
class LaborCategoryService {
  /**
   * Get all labor categories
   * Bearer token required
   */
  async getAll(): Promise<LaborCategory[]> {
    const response = await apiClient.post<GetLaborCategoriesResponse>(
      LABOR_CATEGORY_ENDPOINTS.GET_ALL,
      {}
    );
    return response.data.data.sort((a, b) => a.category_name.localeCompare(b.category_name));
  }
}

export const laborCategoryService = new LaborCategoryService();


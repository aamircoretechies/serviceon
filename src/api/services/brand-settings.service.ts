/**
 * Brand Settings Service
 * 
 * Service layer for brand settings API calls
 */

import { apiClient } from '../client';
import { BRAND_SETTINGS_ENDPOINTS } from '../endpoints';
import type { 
  GetBrandSettingsResponse,
  BrandSettingsData,
  CreateOrUpdateBrandSettingsRequest,
  CreateOrUpdateBrandSettingsResponse,
} from '../types';

/**
 * Brand Settings Service Class
 */
class BrandSettingsService {
  /**
   * Get brand settings
   * Bearer token required
   * POST request with no data
   */
  async get(): Promise<BrandSettingsData> {
    const response = await apiClient.post<GetBrandSettingsResponse>(
      BRAND_SETTINGS_ENDPOINTS.GET,
      {}
    );
    return response.data.data;
  }

  /**
   * Create or update brand settings
   * Bearer token required
   * Uses form-data format for file upload support
   */
  async createOrUpdate(data: CreateOrUpdateBrandSettingsRequest): Promise<CreateOrUpdateBrandSettingsResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Append logo file if provided
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    // Append all other fields (all optional)
    if (data.show_logo_on_outputs !== undefined) {
      formData.append('show_logo_on_outputs', data.show_logo_on_outputs.toString());
    }
    if (data.company_name !== undefined) {
      formData.append('company_name', data.company_name);
    }
    if (data.phone_number !== undefined) {
      formData.append('phone_number', data.phone_number);
    }
    if (data.address !== undefined) {
      formData.append('address', data.address);
    }
    if (data.email !== undefined) {
      formData.append('email', data.email);
    }
    if (data.website !== undefined) {
      formData.append('website', data.website);
    }
    if (data.show_content_information !== undefined) {
      formData.append('show_content_information', data.show_content_information.toString());
    }
    if (data.show_custom_footer !== undefined) {
      formData.append('show_custom_footer', data.show_custom_footer.toString());
    }
    if (data.footer_text !== undefined) {
      formData.append('footer_text', data.footer_text);
    }

    const response = await apiClient.post<CreateOrUpdateBrandSettingsResponse>(
      BRAND_SETTINGS_ENDPOINTS.CREATE_OR_UPDATE,
      formData
    );
    return response.data;
  }
}

export const brandSettingsService = new BrandSettingsService();
export { BrandSettingsService };


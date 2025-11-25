/**
 * PDF Configuration Service
 * 
 * Service layer for PDF configuration API calls
 */

import { apiClient } from '../client';
import { PDF_CONFIGURATION_ENDPOINTS } from '../endpoints';
import type { 
  GetPdfConfigurationResponse,
  PdfConfigurationData,
  CreateOrUpdatePdfConfigurationRequest,
  CreateOrUpdatePdfConfigurationResponse,
} from '../types';

/**
 * PDF Configuration Service Class
 */
class PdfConfigurationService {
  /**
   * Get PDF configuration
   * Bearer token required
   * POST request with no data
   */
  async get(): Promise<PdfConfigurationData> {
    const response = await apiClient.post<GetPdfConfigurationResponse>(
      PDF_CONFIGURATION_ENDPOINTS.GET,
      {}
    );
    return response.data.data;
  }

  /**
   * Create or update PDF configuration
   * Bearer token required
   * Uses form-data format for file upload support
   */
  async createOrUpdate(data: CreateOrUpdatePdfConfigurationRequest): Promise<CreateOrUpdatePdfConfigurationResponse> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Append header_title if provided
    if (data.header_title !== undefined && data.header_title !== null && data.header_title.trim() !== '') {
      formData.append('header_title', data.header_title.trim());
    }
    
    // Append footer_text if provided
    if (data.footer_text !== undefined && data.footer_text !== null && data.footer_text.trim() !== '') {
      formData.append('footer_text', data.footer_text.trim());
    }
    
    // Append logo file if provided
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    // Append signature_placement if provided (1-4)
    if (data.signature_placement !== undefined && data.signature_placement !== null) {
      formData.append('signature_placement', data.signature_placement.toString());
    }
    
    // Append apply_on_all_garages if provided (0 or 1)
    if (data.apply_on_all_garages !== undefined && data.apply_on_all_garages !== null) {
      formData.append('apply_on_all_garages', data.apply_on_all_garages.toString());
    }

    const response = await apiClient.post<CreateOrUpdatePdfConfigurationResponse>(
      PDF_CONFIGURATION_ENDPOINTS.CREATE_OR_UPDATE,
      formData
    );
    return response.data;
  }
}

export const pdfConfigurationService = new PdfConfigurationService();
export { PdfConfigurationService };


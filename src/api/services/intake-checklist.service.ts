/**
 * Intake Checklist Service
 * 
 * Service layer for intake checklist-related API calls
 */

import { apiClient } from '../client';
import { INTAKE_CHECKLIST_ENDPOINTS } from '../endpoints';
import type { 
  CreateIntakeChecklistItemRequest,
  CreateIntakeChecklistItemResponse,
  GetIntakeChecklistItemsResponse,
  UpdateIntakeChecklistItemRequest,
  UpdateIntakeChecklistItemResponse,
  DeleteIntakeChecklistItemRequest,
  DeleteIntakeChecklistItemResponse,
  SetArrangeOrderRequest,
  SetArrangeOrderResponse
} from '../types';

/**
 * Intake Checklist Service Class
 */
class IntakeChecklistService {
  /**
   * Create a new checklist item
   * Bearer token required
   * Uses form-data
   */
  async create(data: CreateIntakeChecklistItemRequest): Promise<CreateIntakeChecklistItemResponse> {
    const formData = new FormData();
    
    formData.append('field_label', data.field_label);
    formData.append('field_type', data.field_type);
    formData.append('is_required', data.is_required ? '1' : '0');
    
    if (data.placeholder_text) {
      formData.append('placeholder_text', data.placeholder_text);
    } else {
      formData.append('placeholder_text', '');
    }

    const response = await apiClient.post<CreateIntakeChecklistItemResponse>(
      INTAKE_CHECKLIST_ENDPOINTS.CREATE,
      formData
    );
    return response.data;
  }

  /**
   * Get all checklist items
   * Bearer token required
   */
  async getAll(): Promise<GetIntakeChecklistItemsResponse> {
    const response = await apiClient.post<GetIntakeChecklistItemsResponse>(
      INTAKE_CHECKLIST_ENDPOINTS.GET_ALL,
      {}
    );
    return response.data;
  }

  /**
   * Update a checklist item
   * Bearer token required
   * Uses form-data
   */
  async update(data: UpdateIntakeChecklistItemRequest): Promise<UpdateIntakeChecklistItemResponse> {
    const formData = new FormData();
    
    formData.append('checklist_item_id', data.checklist_item_id.toString());
    formData.append('field_label', data.field_label);
    formData.append('field_type', data.field_type);
    formData.append('is_required', data.is_required ? '1' : '0');
    
    if (data.placeholder_text) {
      formData.append('placeholder_text', data.placeholder_text);
    } else {
      formData.append('placeholder_text', '');
    }

    const response = await apiClient.put<UpdateIntakeChecklistItemResponse>(
      INTAKE_CHECKLIST_ENDPOINTS.UPDATE,
      formData
    );
    return response.data;
  }

  /**
   * Delete a checklist item
   * Bearer token required
   * Uses form-data
   */
  async delete(data: DeleteIntakeChecklistItemRequest): Promise<DeleteIntakeChecklistItemResponse> {
    const formData = new FormData();
    formData.append('checklist_item_id', data.checklist_item_id.toString());

    const response = await apiClient.delete<DeleteIntakeChecklistItemResponse>(
      INTAKE_CHECKLIST_ENDPOINTS.DELETE,
      { data: formData }
    );
    return response.data;
  }

  /**
   * Set arrange order for checklist items
   * Bearer token required
   * Uses form-data
   */
  async setArrangeOrder(data: SetArrangeOrderRequest): Promise<SetArrangeOrderResponse> {
    const formData = new FormData();
    
    // Append arrays - Spring Boot expects multiple parameters with same name
    data.checklist_item_ids.forEach(id => {
      formData.append('checklist_item_ids', id.toString());
    });
    
    data.order_positions.forEach(position => {
      formData.append('order_positions', position.toString());
    });

    const response = await apiClient.post<SetArrangeOrderResponse>(
      INTAKE_CHECKLIST_ENDPOINTS.SET_ARRANGE_ORDER,
      formData
    );
    return response.data;
  }
}

export const intakeChecklistService = new IntakeChecklistService();


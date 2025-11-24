/**
 * API Types
 * 
 * TypeScript types and interfaces for API requests and responses
 */

/**
 * Standard API Response Wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    from?: number;
    to?: number;
  };
  message?: string;
  status?: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  status?: number;
  error?: string;
}

/**
 * Request Parameters for List Endpoints
 */
export interface ListRequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: {
    [key: string]: any;
  };
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response
 * Actual API response structure
 */
export interface LoginResponse {
  user_role: number;
  user_status: number;
  bearer_token: string;
  user_id: number;
  message: string;
  status: number;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Forgot Password Request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Generic CRUD Types
 */
export interface CreateRequest<T = any> {
  [key: string]: any;
}

export interface UpdateRequest<T = any> {
  [key: string]: any;
}

/**
 * File Upload Request
 */
export interface FileUploadRequest {
  file: File;
  folder?: string;
  tags?: string[];
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  id: string | number;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}

/**
 * Timezone Model
 */
export interface Timezone {
  id: number;
  timezone_name: string;
  timezone_code: string;
  utc_offset: string;
  country: string;
  country_code: string;
  city: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

/**
 * Timezones Response
 */
export interface TimezonesResponse {
  data: Timezone[];
  message: string;
  status: number;
}

/**
 * Garage Create Request
 */
export interface CreateGarageRequest {
  garage_name: string;
  garage_phone_number: string;
  garage_email_address: string;
  garage_description: string;
  garage_street_address: string;
  garage_city: string;
  garage_state: string;
  garage_zip_code: string;
  time_zone_id: number;
  status: number;
  garage_brand_color: string;
  garage_logo?: File;
}

/**
 * Garage Model
 */
export interface Garage {
  garage_id: number;
  garage_name: string;
  garage_phone_number: string;
  garage_email_address: string;
  garage_description: string;
  garage_logo: string;
  garage_street_address: string;
  garage_city: string;
  garage_state: string;
  garage_zip_code: string;
  time_zone_id: number;
  status: number;
  garage_brand_color: string;
  created: string;
  updated: string;
}

/**
 * Garage Create Response
 */
export interface CreateGarageResponse {
  data: Garage;
  message: string;
  status: number;
}

/**
 * Garage Get All Request
 */
export interface GetGaragesRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: number | string;
}

/**
 * Paginated Garage Content
 */
export interface PaginatedGarageContent {
  content: Garage[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

/**
 * Garage Get All Response
 */
export interface GetGaragesResponse {
  data: {
    garages: PaginatedGarageContent;
    total_garages_count: number;
    active_garages_count: number;
  };
  message: string;
  status: number;
}

/**
 * Garage Update Request
 */
export interface UpdateGarageRequest {
  garage_id: number;
  garage_name: string;
  garage_phone_number: string;
  garage_email_address: string;
  garage_description: string;
  garage_street_address: string;
  garage_city: string;
  garage_state: string;
  garage_zip_code: string;
  time_zone_id: number;
  status: number;
  garage_brand_color: string;
  garage_logo?: File;
}

/**
 * Garage Update Response
 */
export interface UpdateGarageResponse {
  data: Garage;
  message: string;
  status: number;
}

/**
 * Garage Delete Request
 */
export interface DeleteGarageRequest {
  garage_id: number;
}

/**
 * Garage Delete Response
 */
export interface DeleteGarageResponse {
  message: string;
  status: number;
}

/**
 * User Create Request (Direct Registration)
 */
export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
  status: number; // 1 for active, 0 for inactive
  user_role: number; // 1 for Admin, 2 for Technician, 3 for Customer
  send_welcome_email: number; // 1 for yes, 0 for no
  require_password_change: number; // 1 for yes, 0 for no
  garage_ids: string; // Comma-separated garage IDs
}

/**
 * User Create Response
 */
export interface CreateUserResponse {
  message: string;
  status: number;
}

/**
 * User Model
 */
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_status: number;
  mobile_number: string;
  status: number;
  created: string;
  updated: string | null;
  profile_image: string | null;
  address1: string | null;
  is2_fa_enabled: number;
  last_login_updated: string | null;
  user_role: number; // 1 for Admin, 2 for Technician, 3 for Customer
}

/**
 * Paginated User Content
 */
export interface PaginatedUserContent {
  content: User[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

/**
 * Get Users Request
 */
export interface GetUsersRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: number | string;
  user_role?: number | string;
}

/**
 * Get Users Response
 */
export interface GetUsersResponse {
  data: PaginatedUserContent;
  message: string;
  status: number;
}

/**
 * Update User Profile Request
 */
export interface UpdateUserProfileRequest {
  user_id: number;
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  address1?: string;
  profile_image?: File;
}

/**
 * Update User Profile Response
 */
export interface UpdateUserProfileResponse {
  data: User;
  message: string;
  status: number;
}

/**
 * Toggle User Status Request
 */
export interface ToggleUserStatusRequest {
  user_id: number;
  status: number; // 0 to disable, 1 to enable
}

/**
 * Toggle User Status Response
 */
export interface ToggleUserStatusResponse {
  message: string;
  status: number;
}

/**
 * Delete User Account Request
 */
export interface DeleteUserAccountRequest {
  user_id: number;
}

/**
 * Delete User Account Response
 */
export interface DeleteUserAccountResponse {
  message: string;
  status: number;
}

/**
 * Job Type Model
 */
export interface JobType {
  job_type_id: number;
  job_type_name: string;
  job_type_code: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get Job Types Response
 */
export interface GetJobTypesResponse {
  data: JobType[];
  message: string;
  status: number;
}

/**
 * Service Type Model
 */
export interface ServiceType {
  service_type_id: number;
  service_type_name: string;
  service_type_code: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get Service Types Response
 */
export interface GetServiceTypesResponse {
  data: ServiceType[];
  message: string;
  status: number;
}

/**
 * Create Job Request
 */
export interface CreateJobRequest {
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_license_plate?: string;
  vehicle_vin?: string;
  vehicle_mileage?: string;
  customer_name?: string;
  customer_phone_number?: string;
  customer_email_address?: string;
  job_type_id?: number;
  job_priority?: number;
  job_estimated_hours?: string;
  job_estimated_cost?: string;
  job_description?: string;
  job_service_type?: number;
  garage_id?: number;
  mechanic_id?: number;
  status?: number;
  timer?: string;
  extra_data?: string;
  part_name?: string[];
  part_count?: number[];
  part_number?: string[];
  part_description?: string[];
  part_cost_total?: string[];
}

/**
 * Job Part Model
 */
export interface JobPart {
  job_part_id?: number;
  part_id?: number;
  job_id?: number;
  part_name?: string;
  part_count?: number;
  part_number?: string;
  part_description?: string;
  part_cost_total?: string;
  created?: string;
  updated?: string;
}

/**
 * Job Model
 */
export interface Job {
  job_id?: number;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_license_plate?: string;
  vehicle_vin?: string;
  vehicle_mileage?: string;
  customer_name?: string;
  customer_phone_number?: string;
  customer_email_address?: string;
  job_type_id?: number;
  job_priority?: number;
  job_estimated_hours?: string;
  job_estimated_cost?: string;
  job_description?: string;
  job_service_type?: number;
  garage_id?: number;
  mechanic_id?: number;
  status?: number;
  timer?: string;
  extra_data?: string;
  created?: string;
  updated?: string;
  parts?: JobPart[];
}

/**
 * Create Job Response
 */
export interface CreateJobResponse {
  data: Job;
  message: string;
  status: number;
}

/**
 * Get Jobs Request
 */
export interface GetJobsRequest {
  page_number?: number;
  page_size?: number;
  search?: string;
  garage_id?: number;
  mechanic_id?: number;
  status?: number;
}

/**
 * Job with Parts
 */
export interface JobWithParts extends Job {
  job_parts?: JobPart[];
}

/**
 * Get Jobs Response Data
 */
export interface GetJobsResponseData {
  total_elements: number;
  jobs: JobWithParts[];
  total_pages: number;
  current_page: number;
  page_size: number;
}

/**
 * Get Jobs Response
 */
export interface GetJobsResponse {
  data: GetJobsResponseData;
  message: string;
  status: number;
}

/**
 * Start Timer Request
 */
export interface StartTimerRequest {
  job_id: number;
}

/**
 * Start Timer Response
 */
export interface StartTimerResponse {
  data: JobWithParts;
  message: string;
  status: number;
}

/**
 * Stop Timer Request
 */
export interface StopTimerRequest {
  job_id: number;
}

/**
 * Stop Timer Response
 */
export interface StopTimerResponse {
  data: {
    elapsed_time: string;
    job: JobWithParts;
  };
  message: string;
  status: number;
}

/**
 * Update Job Status Request
 */
export interface UpdateJobStatusRequest {
  job_id: number;
  status: number; // 1=Complete, 2=Pending, 3=In progress, 4=onHold, 5=cancelled
}

/**
 * Update Job Status Response
 */
export interface UpdateJobStatusResponse {
  data: JobWithParts;
  message: string;
  status: number;
}

/**
 * Delete Job Request
 */
export interface DeleteJobRequest {
  job_id: number;
}

/**
 * Delete Job Response
 */
export interface DeleteJobResponse {
  message: string;
  status: number;
}

/**
 * Update Job Request (same as CreateJobRequest but with job_id)
 */
export interface UpdateJobRequest extends CreateJobRequest {
  job_id: number;
}

/**
 * Update Job Response
 */
export interface UpdateJobResponse {
  data: JobWithParts;
  message: string;
  status: number;
}

/**
 * Brand Settings Data
 */
export interface BrandSettingsData {
  id?: number;
  logo?: string | null;
  show_logo_on_outputs?: number;
  company_name?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  website?: string;
  show_content_information?: number;
  show_custom_footer?: number;
  footer_text?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get Brand Settings Response
 */
export interface GetBrandSettingsResponse {
  data: BrandSettingsData;
  message: string;
  status: number;
}

/**
 * Create or Update Brand Settings Request
 */
export interface CreateOrUpdateBrandSettingsRequest {
  logo?: File | null;
  show_logo_on_outputs?: number;
  company_name?: string;
  phone_number?: string;
  address?: string;
  email?: string;
  website?: string;
  show_content_information?: number;
  show_custom_footer?: number;
  footer_text?: string;
}

/**
 * Create or Update Brand Settings Response
 */
export interface CreateOrUpdateBrandSettingsResponse {
  message: string;
  status: number;
}

/**
 * Labor Category
 */
export interface LaborCategory {
  labor_category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get Labor Categories Response
 */
export interface GetLaborCategoriesResponse {
  data: LaborCategory[];
  message: string;
  status: number;
}

/**
 * Create Labor Rate Request
 */
export interface CreateLaborRateRequest {
  standard_rate: number;
  overtime_rate: number;
  weekend_rate: number;
  holiday_rate: number;
  currency: string;
  billing_unit: string;
  labor_category_id: number;
  notes?: string;
  garage_id: number;
}

/**
 * Labor Rate
 */
export interface LaborRate {
  id: number;
  labor_category_id: number;
  garage_id: number;
  standard_rate: number;
  overtime_rate: number;
  weekend_rate: number;
  holiday_rate: number;
  currency: string;
  billing_unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create Labor Rate Response
 */
export interface CreateLaborRateResponse {
  data: LaborRate;
  message: string;
  status: number;
}

/**
 * Get Labor Rates Response
 */
export interface GetLaborRatesResponse {
  data: LaborRate[];
  message: string;
  status: number;
}

/**
 * Intake Checklist Item
 */
export interface IntakeChecklistItem {
  checklist_item_id: number;
  field_label: string;
  field_type: string;
  placeholder_text?: string;
  is_required: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

/**
 * Create Intake Checklist Item Request
 */
export interface CreateIntakeChecklistItemRequest {
  field_label: string;
  field_type: string;
  placeholder_text?: string;
  is_required: boolean;
}

/**
 * Create Intake Checklist Item Response
 */
export interface CreateIntakeChecklistItemResponse {
  data: IntakeChecklistItem;
  message: string;
  status: number;
}

/**
 * Get Intake Checklist Items Response
 */
export interface GetIntakeChecklistItemsResponse {
  data: {
    latest_updated: string;
    total_count: number;
    checklist_items: IntakeChecklistItem[];
  };
  message: string;
  status: number;
}

/**
 * Update Intake Checklist Item Request
 */
export interface UpdateIntakeChecklistItemRequest {
  checklist_item_id: number;
  field_label: string;
  field_type: string;
  placeholder_text?: string;
  is_required: boolean;
}

/**
 * Update Intake Checklist Item Response
 */
export interface UpdateIntakeChecklistItemResponse {
  message: string;
  status: number;
}

/**
 * Delete Intake Checklist Item Request
 */
export interface DeleteIntakeChecklistItemRequest {
  checklist_item_id: number;
}

/**
 * Delete Intake Checklist Item Response
 */
export interface DeleteIntakeChecklistItemResponse {
  message: string;
  status: number;
}

/**
 * Set Arrange Order Request
 */
export interface SetArrangeOrderRequest {
  checklist_item_ids: number[];
  order_positions: number[];
}

/**
 * Set Arrange Order Response
 */
export interface SetArrangeOrderResponse {
  message: string;
  status: number;
}


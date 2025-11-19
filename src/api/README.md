# API Module Documentation

This directory contains the centralized API configuration, endpoints, and services for the ServiceOn application.

## 📁 Structure

```
api/
├── config.ts              # API configuration (base URL, timeout, etc.)
├── endpoints.ts           # All API endpoint definitions
├── types.ts               # TypeScript types for API requests/responses
├── client.ts              # Axios client with interceptors
├── services/              # Service layer for API calls
│   ├── auth.service.ts    # Authentication service
│   └── index.ts           # Service exports
├── index.ts               # Main exports
└── README.md              # This file
```

## 🚀 Usage

### Basic Usage

```typescript
import { apiClient, AUTH_ENDPOINTS } from '@/api';
import type { LoginRequest, LoginResponse } from '@/api/types';

// Direct API call
const response = await apiClient.post<LoginResponse>(
  AUTH_ENDPOINTS.LOGIN,
  { email: 'user@example.com', password: 'password' }
);
```

### Using Services (Recommended)

```typescript
import { authService } from '@/api/services';

// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const user = await authService.getCurrentUser();
```

### Using Endpoints

```typescript
import { API_ENDPOINTS } from '@/api';

// Static endpoints
const loginUrl = API_ENDPOINTS.AUTH.LOGIN;

// Dynamic endpoints (with parameters)
const garageUrl = API_ENDPOINTS.GARAGES.GET(123);
const jobPartsUrl = API_ENDPOINTS.JOBS.PARTS('JOB-001');
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_APP_API_URL=http://localhost:8000/api
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2
```

### API Configuration

The API configuration is in `config.ts`:

- **BASE_URL**: Read from `VITE_APP_API_URL` environment variable
- **TIMEOUT**: 30 seconds (configurable)
- **HEADERS**: Default headers (Content-Type, Accept)

## 🔐 Authentication

The API client automatically:
- Adds `Authorization: Bearer <token>` header to requests
- Handles 401 errors by clearing auth and redirecting to login
- Shows error messages via toast notifications

## 📝 Types

All API types are defined in `types.ts`:

- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated list response
- `ApiErrorResponse` - Error response format
- `LoginRequest`, `LoginResponse` - Auth types
- And more...

## 🎯 Best Practices

1. **Use Services**: Prefer using service classes over direct API calls
2. **Type Safety**: Always use TypeScript types for requests/responses
3. **Error Handling**: Errors are handled globally, but you can catch them for custom handling
4. **Endpoints**: Always use endpoint constants, never hardcode URLs

## 📚 Examples

### Example: Login Implementation

```typescript
import { authService } from '@/api/services';
import { toast } from 'sonner';

try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password'
  });
  
  // Handle success
  console.log('Login successful', response);
} catch (error) {
  // Error is already handled by interceptor
  // But you can add custom handling here
  console.error('Login failed', error);
}
```

### Example: Creating a New Service

```typescript
// api/services/garages.service.ts
import { apiClient } from '../client';
import { GARAGES_ENDPOINTS } from '../endpoints';
import type { ApiResponse, PaginatedResponse } from '../types';

class GaragesService {
  async list(params?: any) {
    const response = await apiClient.get<PaginatedResponse>(
      GARAGES_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  }

  async get(id: string | number) {
    const response = await apiClient.get<ApiResponse>(
      GARAGES_ENDPOINTS.GET(id)
    );
    return response.data.data;
  }

  async create(data: any) {
    const response = await apiClient.post<ApiResponse>(
      GARAGES_ENDPOINTS.CREATE,
      data
    );
    return response.data.data;
  }
}

export const garagesService = new GaragesService();
```

## 🔄 Migration from Old Code

If you have existing code using direct axios calls:

**Before:**
```typescript
import axios from 'axios';
const response = await axios.post(`${API_URL}/login`, data);
```

**After:**
```typescript
import { authService } from '@/api/services';
const response = await authService.login(data);
```

## 🐛 Error Handling

Errors are automatically handled by the response interceptor:
- **401**: Clears auth, redirects to login
- **403**: Shows "Permission denied" message
- **404**: Shows "Resource not found" message
- **422**: Shows validation errors
- **500**: Shows "Server error" message
- **Network errors**: Shows "Network error" message

All errors are displayed via toast notifications.

## 📖 Next Steps

1. Implement remaining services (garages, jobs, users, etc.)
2. Add React Query hooks for data fetching
3. Add request/response logging (optional)
4. Add retry logic for failed requests (optional)


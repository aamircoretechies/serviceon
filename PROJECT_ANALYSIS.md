# ServiceOn - Complete Project Analysis

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Navigation & Routing](#navigation--routing)
5. [Authentication System](#authentication-system)
6. [Data Flow & State Management](#data-flow--state-management)
7. [API Integration Points](#api-integration-points)
8. [Component Architecture](#component-architecture)
9. [Key Features & Modules](#key-features--modules)
10. [Environment Configuration](#environment-configuration)
11. [Recommendations for API Implementation](#recommendations-for-api-implementation)

---

## 🎯 Project Overview

**ServiceOn** is a comprehensive automotive service management system with a React-based admin panel. The project is currently in UI build phase and requires backend API integration.

### Key Characteristics:
- **Type**: Admin Dashboard / Service Management System
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.11
- **UI Library**: Custom components built on Radix UI + Tailwind CSS
- **State Management**: React Query (TanStack Query) + Context API
- **Routing**: React Router v6.28.0
- **HTTP Client**: Axios 1.7.7

---

## 🛠 Technology Stack

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "typescript": "^5.6.3",
  "vite": "^5.4.11",
  "axios": "^1.7.7",
  "@tanstack/react-query": "^5.59.20",
  "@tanstack/react-table": "^8.20.5"
}
```

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **Shadcn UI**: Component library (custom implementation)

### Form Management
- **Formik**: Form state management
- **Yup**: Schema validation

### Additional Libraries
- **date-fns**: Date manipulation
- **react-intl**: Internationalization
- **ApexCharts**: Charting library
- **react-leaflet**: Maps integration

---

## 📁 Project Structure

```
serviceon/
├── src/
│   ├── auth/                    # Authentication system
│   │   ├── _helpers.ts          # Auth utilities (localStorage, axios setup)
│   │   ├── _models.ts           # Auth & User type definitions
│   │   ├── AuthPage.tsx         # Auth page wrapper
│   │   ├── RequireAuth.tsx      # Protected route wrapper
│   │   ├── providers/
│   │   │   └── JWTProvider.tsx  # JWT authentication provider
│   │   └── pages/jwt/           # JWT auth pages (login, signup, etc.)
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components (Button, Card, Input, etc.)
│   │   ├── data-grid/           # Data table component with server-side support
│   │   ├── modal/               # Modal components
│   │   ├── drawer/              # Drawer/sidebar components
│   │   └── ...
│   │
│   ├── pages/                   # Page components
│   │   ├── admin/               # Admin panel pages ⭐ MAIN FOCUS
│   │   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── garages/         # Garage management
│   │   │   ├── jobs/            # Job management
│   │   │   ├── users/           # User management
│   │   │   ├── branding/        # Branding settings
│   │   │   ├── checklist/       # Intake checklist
│   │   │   ├── labor-rates/     # Labor rate configuration
│   │   │   ├── reminders/       # Reminder templates & scheduling
│   │   │   ├── vehicles/        # Vehicle history
│   │   │   ├── media/           # Media library
│   │   │   ├── pdf/             # PDF configuration
│   │   │   ├── system/          # System settings
│   │   │   └── activity/        # Activity log
│   │   ├── dashboards/          # Dashboard pages
│   │   ├── account/             # Account management pages
│   │   ├── network/             # Network/user pages
│   │   └── public-profile/      # Public profile pages
│   │
│   ├── layouts/                 # Layout components
│   │   └── demo1/               # Main admin layout (Demo1Layout)
│   │
│   ├── routing/                 # Route configuration
│   │   ├── AppRouting.tsx       # Main routing component
│   │   └── AppRoutingSetup.tsx  # Route definitions
│   │
│   ├── providers/               # Context providers
│   │   ├── ProvidersWrapper.tsx # Main provider wrapper
│   │   ├── SettingsProvider.tsx # Theme/settings
│   │   ├── TranslationProvider.tsx # i18n
│   │   └── ...
│   │
│   ├── config/                  # Configuration files
│   │   ├── menu.config.tsx      # Menu structure
│   │   ├── admin-menu.config.tsx # Admin menu
│   │   └── general.config.ts    # General settings
│   │
│   ├── utils/                   # Utility functions
│   │   ├── Assets.ts            # Asset helpers
│   │   ├── Data.ts              # Data utilities
│   │   ├── LocalStorage.ts      # LocalStorage helpers
│   │   └── ...
│   │
│   └── styles/                  # Global styles
│       ├── globals.css          # Global CSS
│       └── ...
│
├── public/                      # Static assets
│   └── media/                   # Images, avatars, etc.
│
├── package.json                 # Dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── tailwind.config.js           # Tailwind configuration
```

---

## 🧭 Navigation & Routing

### Route Structure

#### Public Routes
- `/auth/*` - Authentication pages (login, signup, password reset)
- `/admin/login` - Admin login page
- `/error/*` - Error pages (404, 500)

#### Protected Routes (Require Authentication)
All routes wrapped in `<RequireAuth />` component use `Demo1Layout`.

**Main Admin Routes:**
```
/                                    → Admin Dashboard
/admin/garages                       → Garages List
/admin/garages/create                → Create Garage
/admin/jobs                          → Jobs List
/admin/jobs/create                   → Create Job
/admin/jobs/:id                      → Job Details
/admin/users                         → Users List
/admin/users/create                  → Create User
/admin/branding                      → Branding Settings
/admin/branding/output               → Branding Output
/admin/checklist                     → Intake Checklist Config
/admin/labor-rates                   → Labor Rates
/admin/reminders/templates           → Reminder Templates
/admin/reminders/templates/create   → Create Reminder Template
/admin/reminders/scheduled           → Scheduled Reminders
/admin/vehicles                      → Vehicle History
/admin/vehicles/:id                 → Vehicle Detail
/admin/media                         → Media Library
/admin/pdf-config                    → PDF Configuration
/admin/system                        → System Settings
/admin/activity                      → Activity Log
```

### Navigation Flow
1. **Entry Point**: `main.tsx` → `App.tsx` → `AppRouting.tsx`
2. **Auth Check**: `AppRouting.tsx` calls `verify()` on route changes
3. **Layout**: Authenticated routes use `Demo1Layout` with sidebar navigation
4. **Menu**: Sidebar menu configured in `menu.config.tsx` and `admin-menu.config.tsx`

---

## 🔐 Authentication System

### Authentication Provider
- **Provider**: `JWTProvider` (`src/auth/providers/JWTProvider.tsx`)
- **Context**: `AuthContext` provides auth state and methods

### Key Features
1. **JWT Token Storage**: Tokens stored in localStorage
2. **Axios Interceptor**: Automatically adds `Authorization: Bearer <token>` header
3. **Token Verification**: `verify()` method checks token validity on route changes
4. **User Management**: `currentUser` state holds logged-in user data

### Auth Methods
```typescript
interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, password_confirmation: string) => Promise<void>
  logout: () => void
  verify: () => Promise<void>
  getUser: () => Promise<AxiosResponse<UserModel>>
  requestPasswordResetLink: (email: string) => Promise<void>
  changePassword: (email, token, password, password_confirmation) => Promise<void>
}
```

### API Endpoints (Expected)
```typescript
const API_URL = import.meta.env.VITE_APP_API_URL;

LOGIN_URL = `${API_URL}/login`
REGISTER_URL = `${API_URL}/register`
FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`
RESET_PASSWORD_URL = `${API_URL}/reset-password`
GET_USER_URL = `${API_URL}/user`
```

### Auth Models
```typescript
interface AuthModel {
  access_token: string
  refreshToken?: string
  api_token: string
}

interface UserModel {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  fullname?: string
  phone?: string
  roles?: number[]
  pic?: string
  // ... more fields
}
```

---

## 📊 Data Flow & State Management

### State Management Strategy
1. **React Query (TanStack Query)**: Server state management
   - Caching
   - Background refetching
   - Optimistic updates
   - Query invalidation

2. **Context API**: 
   - Authentication state (`AuthContext`)
   - Settings/Theme (`SettingsProvider`)
   - Translations (`TranslationProvider`)
   - Layout state (`LayoutProvider`)

3. **Local State**: 
   - Component-level state with `useState`
   - Form state with Formik

### Data Fetching Pattern
The project uses a **DataGrid** component that supports server-side data fetching:

```typescript
// Example from Teams.tsx
const fetchTeams = async (params: TDataGridRequestParams) => {
  const queryParams = new URLSearchParams();
  queryParams.set('page', String(params.pageIndex + 1));
  queryParams.set('items_per_page', String(params.pageSize));
  
  if (params.sorting?.[0]?.id) {
    queryParams.set('sort', params.sorting[0].id);
    queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
  }
  
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_URL}/teams/query?${queryParams.toString()}`
  );
  
  return {
    data: response.data.data,
    totalCount: response.data.pagination.total
  };
};
```

### Axios Configuration
- **Base URL**: `VITE_APP_API_URL` environment variable
- **Interceptors**: 
  - Request: Adds `Authorization: Bearer <token>` header
  - Response: (Can be extended for error handling)

---

## 🔌 API Integration Points

### Current Status
⚠️ **Most pages use mock data** - Need to replace with actual API calls

### Pages Requiring API Integration

#### 1. **Admin Dashboard** (`/admin/dashboard`)
**Endpoints Needed:**
- `GET /admin/dashboard/kpis` - Multi-garage summary KPIs
- `GET /admin/dashboard/jobs` - Recent jobs overview
- `GET /admin/dashboard/reminders` - Upcoming reminders
- `GET /admin/dashboard/activities` - Activity feed
- `GET /admin/dashboard/media-stats` - Media upload statistics
- `GET /admin/dashboard/pdf-stats` - PDF generation statistics
- `GET /admin/dashboard/system-status` - System status indicators

#### 2. **Garages Management** (`/admin/garages`)
**Endpoints Needed:**
- `GET /admin/garages` - List all garages (with pagination, search, filters)
- `GET /admin/garages/:id` - Get garage details
- `POST /admin/garages` - Create new garage
- `PUT /admin/garages/:id` - Update garage
- `DELETE /admin/garages/:id` - Delete garage
- `GET /admin/garages/:id/branding` - Get garage branding settings

#### 3. **Jobs Management** (`/admin/jobs`)
**Endpoints Needed:**
- `GET /admin/jobs` - List all jobs (with filters: garage, mechanic, status)
- `GET /admin/jobs/:id` - Get job details
- `POST /admin/jobs` - Create new job
- `PUT /admin/jobs/:id` - Update job
- `PUT /admin/jobs/:id/assign-mechanic` - Assign mechanic to job
- `PUT /admin/jobs/:id/timer` - Start/pause/stop timer
- `PUT /admin/jobs/:id/status` - Update job status
- `GET /admin/jobs/:id/parts` - Get job parts list

#### 4. **Users Management** (`/admin/users`)
**Endpoints Needed:**
- `GET /admin/users` - List all users (with pagination, search, filters)
- `GET /admin/users/:id` - Get user details
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/status` - Enable/disable user
- `POST /admin/users/:id/reset-password` - Reset user password
- `GET /admin/users/roles` - Get all roles
- `GET /admin/users/permissions` - Get permissions matrix

#### 5. **Reminders** (`/admin/reminders`)
**Endpoints Needed:**
- `GET /admin/reminders/templates` - List reminder templates
- `GET /admin/reminders/templates/:id` - Get template details
- `POST /admin/reminders/templates` - Create template
- `PUT /admin/reminders/templates/:id` - Update template
- `DELETE /admin/reminders/templates/:id` - Delete template
- `GET /admin/reminders/scheduled` - List scheduled reminders
- `POST /admin/reminders/scheduled` - Schedule reminder

#### 6. **Vehicles** (`/admin/vehicles`)
**Endpoints Needed:**
- `GET /admin/vehicles` - List vehicle history
- `GET /admin/vehicles/:id` - Get vehicle details
- `GET /admin/vehicles/:id/history` - Get vehicle service history
- `POST /admin/vehicles/:id/notes` - Add note to vehicle

#### 7. **Media Library** (`/admin/media`)
**Endpoints Needed:**
- `GET /admin/media` - List media files (with pagination, filters)
- `POST /admin/media/upload` - Upload media file
- `DELETE /admin/media/:id` - Delete media file
- `GET /admin/media/:id` - Get media file details

#### 8. **Branding** (`/admin/branding`)
**Endpoints Needed:**
- `GET /admin/branding` - Get branding settings
- `PUT /admin/branding` - Update branding settings
- `GET /admin/branding/output` - Get output settings
- `PUT /admin/branding/output` - Update output settings

#### 9. **System Settings** (`/admin/system`)
**Endpoints Needed:**
- `GET /admin/system/settings` - Get system settings
- `PUT /admin/system/settings` - Update system settings
- `GET /admin/system/logs` - Get system logs

#### 10. **Activity Log** (`/admin/activity`)
**Endpoints Needed:**
- `GET /admin/activity` - List activity logs (with pagination, filters)

### API Response Format (Expected)
Based on the DataGrid implementation, the backend should return:

```typescript
// List endpoints
{
  data: T[],                    // Array of items
  pagination: {
    total: number,              // Total count for pagination
    page: number,
    per_page: number,
    total_pages: number
  }
}

// Single item endpoints
{
  data: T                       // Single item
}

// Error response
{
  error: string,
  message: string,
  errors?: { [key: string]: string[] }  // Validation errors
}
```

---

## 🧩 Component Architecture

### Key Components

#### 1. **DataGrid Component**
- **Location**: `src/components/data-grid/`
- **Purpose**: Server-side data table with pagination, sorting, filtering
- **Features**:
  - Server-side data fetching via `onFetchData` prop
  - Client-side data rendering
  - Column visibility
  - Row selection
  - Customizable toolbar

**Usage Example:**
```typescript
<DataGrid
  columns={columns}
  serverSide={true}
  onFetchData={fetchTeams}
  pagination={{ page: 0, size: 10 }}
/>
```

#### 2. **UI Components** (`src/components/ui/`)
Reusable components built on Radix UI:
- `Button`, `Input`, `Card`, `Badge`, `Select`, `Table`, `Dialog`, `Drawer`, etc.

#### 3. **Layout Components**
- `Demo1Layout`: Main admin layout with sidebar, header, and content area

### Component Pattern
Most admin pages follow this pattern:
```typescript
// Page Component (wrapper)
const GaragesListPage = () => {
  return <GaragesListContent />;
};

// Content Component (actual implementation)
const GaragesListContent = () => {
  // State management
  // Data fetching (currently mock)
  // UI rendering
  return <div>...</div>;
};
```

---

## 🎨 Key Features & Modules

### 1. **Multi-Garage Management**
- Support for multiple garage locations
- Garage-specific branding
- Garage-specific settings

### 2. **Job Management**
- Job creation and tracking
- Mechanic assignment
- Timer functionality (start/pause/stop)
- Progress tracking
- Parts management

### 3. **User Management**
- Role-based access control (Admin, Mechanic, Customer)
- User status management (active/inactive)
- Permission matrix
- Password reset functionality

### 4. **Reminders & Notifications**
- Template-based reminders
- Scheduled reminders
- Multi-audience targeting

### 5. **Vehicle History**
- Vehicle service history tracking
- Notes and documentation
- Vehicle details management

### 6. **Media Management**
- File upload
- Media library
- Preview functionality

### 7. **Branding & Output**
- Customizable branding per garage
- PDF configuration
- Output settings

### 8. **System Settings**
- System-wide configuration
- System logs
- Status monitoring

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_APP_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2

# Base URL (for routing)
BASE_URL=/serviceon
```

### Current Configuration
- **Base Path**: `/serviceon` (configured in `vite.config.ts`)
- **API URL**: Read from `VITE_APP_API_URL` environment variable
- **Auth Storage Key**: `${VITE_APP_NAME}-auth-v${VITE_APP_VERSION}`

---

## 🚀 Recommendations for API Implementation

### 1. **Create API Service Layer**

Create a centralized API service:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

// Garage API
export const garageAPI = {
  list: (params) => axios.get(`${API_URL}/admin/garages`, { params }),
  get: (id) => axios.get(`${API_URL}/admin/garages/${id}`),
  create: (data) => axios.post(`${API_URL}/admin/garages`, data),
  update: (id, data) => axios.put(`${API_URL}/admin/garages/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/admin/garages/${id}`),
};

// Similar for other modules...
```

### 2. **Use React Query Hooks**

Create custom hooks for data fetching:

```typescript
// src/hooks/useGarages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { garageAPI } from '@/services/api';

export const useGarages = (params) => {
  return useQuery({
    queryKey: ['garages', params],
    queryFn: () => garageAPI.list(params),
  });
};

export const useCreateGarage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: garageAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['garages']);
    },
  });
};
```

### 3. **Replace Mock Data**

Replace all mock data arrays with API calls:
- `GaragesListContent.tsx` - Replace `garages` array
- `JobsListContent.tsx` - Replace `jobs` array
- `UsersListContent.tsx` - Replace `users` array
- `AdminDashboardContent.tsx` - Replace all mock data

### 4. **Error Handling**

Add global error handling:
- Axios response interceptor for error handling
- Toast notifications for errors
- Error boundaries for component errors

### 5. **Loading States**

Implement proper loading states:
- Use React Query's `isLoading` and `isFetching`
- Show skeleton loaders
- Disable forms during submission

### 6. **Pagination & Filtering**

Ensure all list endpoints support:
- Pagination (page, per_page)
- Sorting (sort, order)
- Filtering (filter[field]=value)
- Search (query parameter)

### 7. **File Upload**

For media uploads:
- Use FormData for file uploads
- Show upload progress
- Handle upload errors gracefully

### 8. **Real-time Updates** (Optional)

Consider WebSocket integration for:
- Real-time job updates
- Live activity feed
- System status monitoring

---

## 📝 Next Steps

1. **Set up API service layer** (`src/services/api.ts`)
2. **Create React Query hooks** (`src/hooks/`)
3. **Replace mock data** in all admin pages
4. **Implement error handling** globally
5. **Add loading states** throughout the app
6. **Test API integration** with backend
7. **Handle edge cases** (empty states, errors, etc.)

---

## 🔍 Key Files to Modify

### High Priority
1. `src/pages/admin/garages/GaragesListContent.tsx`
2. `src/pages/admin/jobs/JobsListContent.tsx`
3. `src/pages/admin/users/UsersListContent.tsx`
4. `src/pages/admin/dashboard/AdminDashboardContent.tsx`

### Medium Priority
5. `src/pages/admin/reminders/*`
6. `src/pages/admin/vehicles/*`
7. `src/pages/admin/media/*`
8. `src/pages/admin/branding/*`

### Low Priority
9. `src/pages/admin/system/*`
10. `src/pages/admin/activity/*`

---

## 📚 Additional Resources

- **React Query Docs**: https://tanstack.com/query/latest
- **Axios Docs**: https://axios-http.com/docs/intro
- **React Router Docs**: https://reactrouter.com/en/main
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

**Last Updated**: 2024-01-20
**Project Version**: 9.1.2


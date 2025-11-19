# Environment Configuration Guide

## 📋 Overview

The API configuration now supports multiple environments: **development**, **testing**, **staging**, and **production**.

## 🔧 Environment Variables

### Option 1: Generic API URL (Highest Priority)
This will be used for all environments if set:

```env
VITE_APP_API_URL=http://localhost:8000/api
```

### Option 2: Environment-Specific URLs (Recommended)
Set different URLs for each environment:

```env
# Development
VITE_APP_API_URL_DEV=http://localhost:8000/api

# Testing
VITE_APP_API_URL_TEST=http://localhost:8000/api

# Staging
VITE_APP_API_URL_STAGING=https://staging-api.serviceon.com/api

# Production
VITE_APP_API_URL_PROD=https://api.serviceon.com/api
```

### Option 3: Environment Mode
You can also set the environment mode:

```env
VITE_APP_ENV=staging
# or
VITE_APP_ENV=production
```

## 📁 Environment Files

Create separate `.env` files for each environment:

### `.env.development`
```env
VITE_APP_API_URL_DEV=http://localhost:8000/api
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2
```

### `.env.testing`
```env
VITE_APP_API_URL_TEST=http://test-api.serviceon.com/api
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2
```

### `.env.staging`
```env
VITE_APP_API_URL_STAGING=https://staging-api.serviceon.com/api
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2
```

### `.env.production`
```env
VITE_APP_API_URL_PROD=https://api.serviceon.com/api
VITE_APP_NAME=ServiceOn
VITE_APP_VERSION=9.1.2
```

## 🚀 Usage

### Development
```bash
npm run dev
# Uses: VITE_APP_API_URL_DEV or http://localhost:8000/api
```

### Testing
```bash
npm run dev --mode testing
# Uses: VITE_APP_API_URL_TEST or http://localhost:8000/api
```

### Staging
```bash
npm run build --mode staging
# Uses: VITE_APP_API_URL_STAGING or https://staging-api.serviceon.com/api
```

### Production
```bash
npm run build
# Uses: VITE_APP_API_URL_PROD or https://api.serviceon.com/api
```

## 🔍 Priority Order

The API URL is determined in this order:

1. **VITE_APP_API_URL** (generic, highest priority)
2. **VITE_APP_API_URL_{ENV}** (environment-specific)
3. **Default URL** for the current environment

## 📝 Example Configuration

### For Local Development
```env
# .env.development
VITE_APP_API_URL_DEV=http://localhost:8000/api
```

### For Staging
```env
# .env.staging
VITE_APP_API_URL_STAGING=https://staging-api.serviceon.com/api
```

### For Production
```env
# .env.production
VITE_APP_API_URL_PROD=https://api.serviceon.com/api
```

## 🛠️ Helper Functions

You can check the current environment in your code:

```typescript
import { isDevelopment, isStaging, isProduction, isTesting } from '@/api/config';

if (isDevelopment()) {
  console.log('Running in development mode');
}

if (isProduction()) {
  // Production-specific code
}
```

## ⚠️ Important Notes

1. **Never commit sensitive URLs** to version control
2. **Use `.env.local`** for local overrides (gitignored)
3. **Update `.env.example`** with placeholder values
4. **Environment variables must start with `VITE_`** to be accessible in the browser

## 📚 Default URLs

If no environment variables are set, the following defaults are used:

- **Development**: `http://localhost:8000/api`
- **Testing**: `http://localhost:8000/api`
- **Staging**: `https://staging-api.serviceon.com/api`
- **Production**: `https://api.serviceon.com/api`

You should update these defaults in `src/api/config.ts` to match your actual API URLs.


# Dark-Nexis Frontend-Backend Integration Guide

This guide provides a complete overview of how to establish and verify the connection between the Dark-Nexis frontend and backend services.

## System Architecture Overview

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Port**: 3000 (or next available)
- **Proxy**: `/api/*` requests forwarded to `http://127.0.0.1:8000`

### Backend
- **Framework**: FastAPI (Python)
- **Port**: 8000
- **API Prefix**: `/api/v1`

### Services
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: MinIO (S3-compatible)
- **Worker**: Celery for background tasks

## Prerequisites

1. **Node.js** (v16+ recommended)
2. **Python** (3.9+)
3. **Docker** (optional, for containerized services)
4. **PostgreSQL** (if not using Docker)

## Starting Services

### Option 1: Using Docker (Recommended)

```bash
# Navigate to backend directory
cd c:\Users\Lenovo\Dark-Nexis\dark-nexis-backend

# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps
```

### Option 2: Manual Start

#### 1. Start Database Services
If using Docker for database services only:
```bash
cd c:\Users\Lenovo\Dark-Nexis\dark-nexis-backend
docker-compose up db redis minio -d
```

#### 2. Start Backend Server
```bash
# Navigate to backend directory
cd c:\Users\Lenovo\Dark-Nexis\dark-nexis-backend\backend

# Activate virtual environment (Windows)
.venv\Scripts\activate.ps1

# Install dependencies
pip install -r requirements.txt

# Set Python path and start server
set PYTHONPATH=.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Start Frontend
```bash
# In project root
cd c:\Users\Lenovo\Dark-Nexis
npm run dev
```

## Environment Configuration

### Frontend (.env in project root)
```env
VITE_API_BASE_URL=/api
```

### Backend (.env in dark-nexis-backend/.env)
```env
# API settings
API_V1_STR=/api/v1
SECRET_KEY=your-256-bit-secret-key
JWT_SECRET_KEY=your-256-bit-secret-key

# Database settings
DATABASE_URL=postgresql://postgres:admin11@localhost:5432/darknexis

# Redis settings
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# S3 settings
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=darknexis
```

## API Endpoints

### Authentication
- **Login**: `POST /api/v1/auth/login/access-token`
- **Signup**: `POST /api/v1/auth/signup`

### Media
- **Get Upload URL**: `POST /api/v1/media/upload?filename={name}&file_size={size}&mime_type={type}`
- **Analyze Media**: `POST /api/v1/media/analyze`
- **Get Analysis Result**: `GET /api/v1/media/{media_id}`

## Testing Connection

### 1. Backend Health Check
```bash
# API root
curl http://localhost:8000/

# API v1 root
curl http://localhost:8000/api/v1/
```

### 2. Authentication Test
```bash
# Demo login
curl -X POST http://localhost:8000/api/v1/auth/login/access-token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo@example.com&password=password"
```

### 3. Media Upload Test
```bash
# First get auth token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login/access-token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo@example.com&password=password" | jq -r .access_token)

# Then test media upload endpoint
curl -X POST "http://localhost:8000/api/v1/media/upload?filename=test.mp4&file_size=1024&mime_type=video/mp4" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Issues and Solutions

### 1. CORS Errors
Ensure the backend CORS settings in `app/core/config.py` allow the frontend origin:
```python
BACKEND_CORS_ORIGINS: List[str] = ["*"]  # For development
# Or specify exact origins:
# BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
```

### 2. Proxy Not Working
Check `vite.config.ts` proxy configuration:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
}
```

### 3. Authentication Failures
Ensure the JWT secret key is properly configured in both frontend and backend `.env` files.

### 4. Database Connection Issues
Verify the `DATABASE_URL` in `.env` files matches your actual database setup.

## Integration Verification

### 1. Service Status
Check that all required services are running:
- Backend API server (port 8000)
- Database (PostgreSQL on port 5432)
- Redis (port 6379)
- MinIO (ports 9000, 9001)

### 2. API Endpoints
Verify all API endpoints are accessible through both direct calls and frontend proxy.

### 3. Authentication Flow
Test the complete authentication flow from login to protected endpoint access.

### 4. File Upload Pipeline
Test the complete file upload pipeline:
1. Get presigned URL
2. Upload file to S3
3. Trigger analysis
4. Retrieve results

## Troubleshooting

### Backend Not Starting
1. Check if all dependencies are installed: `pip install -r requirements.txt`
2. Verify Python path: `set PYTHONPATH=.`
3. Check for missing environment variables

### Frontend Not Connecting
1. Verify proxy configuration in `vite.config.ts`
2. Check browser console for network errors
3. Ensure backend is running on the correct port

### Authentication Issues
1. Verify JWT secret key consistency between frontend and backend
2. Check token expiration settings
3. Validate user credentials (demo: demo@example.com / password)

## Development Best Practices

1. **Always use the `/api/v1` prefix** for all backend endpoints
2. **Handle authentication gracefully** with proper error messages
3. **Implement timeouts** for all network requests
4. **Use mock implementations** for offline development
5. **Log extensively** for debugging connection issues
6. **Test both direct and proxied access** to backend endpoints

## Next Steps

1. Run the connection test script: `connection_test.ts`
2. Verify all services are running
3. Test authentication flow
4. Test file upload pipeline
5. Monitor logs for any errors

This guide should help you establish a robust connection between the Dark-Nexis frontend and backend services.
# Authentication Flow

This document explains how authentication works in the TurbineOps application.

## Overview

The application uses JWT (JSON Web Token) based authentication with the following flow:

1. User logs in with email and password
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in localStorage and Redux store
4. Token is automatically included in all API requests via Authorization header
5. Backend validates token on protected routes

## Frontend Implementation

### Token Storage

Tokens are stored in two places:
- **localStorage**: For persistence across browser sessions
- **Redux Store**: For runtime access

```typescript
// Token is stored on successful login
localStorage.setItem('token', token);
```

### Automatic Token Injection

All API requests automatically include the authentication token:

```typescript
// services/api.ts
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
}
```

### Token Validation

On app initialization, if a token exists in localStorage:
1. Token is loaded into Redux store
2. User is marked as authenticated
3. `getCurrentUser` API call validates the token and fetches user data
4. If token is invalid/expired, user is automatically logged out

### Error Handling

The API service includes automatic error handling for authentication failures:

```typescript
// 401/403 responses trigger automatic logout
if (result.error.status === 401 || result.error.status === 403) {
  api.dispatch(logout());
  window.location.href = '/login';
}
```

## Backend Implementation

### Protected Routes

Routes are protected using middleware:

```typescript
// Requires valid JWT token
router.get('/inspections', authenticate, inspectionController.getInspections);

// Requires specific roles
router.post(
  '/inspections',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  inspectionController.createInspection
);
```

### Middleware Chain

1. **authenticate**: Validates JWT token and extracts user info
2. **authorize**: Checks if user has required role(s)

### Token Format

Backend expects tokens in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## User Roles

The application supports three roles:

- **ADMIN**: Full access to all features
- **ENGINEER**: Can view and modify turbines and inspections
- **VIEWER**: Read-only access

### Role-Based Access Control (RBAC)

#### Frontend
```typescript
// Check if user has required role
const canCreate = useAppSelector(selectHasRole([Role.ADMIN, Role.ENGINEER]));

// Conditionally render UI
{canCreate && <Button>Add Inspection</Button>}
```

#### Backend
```typescript
// Protect routes by role
router.delete(
  '/inspections/:id',
  authenticate,
  authorize(Role.ADMIN),  // Only admins can delete
  inspectionController.deleteInspection
);
```

## API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Protected Endpoints (Auth Required)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/turbines` - List turbines (ADMIN, ENGINEER)
- `POST /api/v1/turbines` - Create turbine (ADMIN, ENGINEER)
- `DELETE /api/v1/turbines/:id` - Delete turbine (ADMIN only)
- `GET /api/v1/inspections` - List inspections (ADMIN, ENGINEER)
- `POST /api/v1/inspections` - Create inspection (ADMIN, ENGINEER)
- `DELETE /api/v1/inspections/:id` - Delete inspection (ADMIN only)

## Security Best Practices

### Implemented
✅ JWT tokens with expiration
✅ Secure password hashing (bcrypt)
✅ Token validation on every protected request
✅ Role-based access control
✅ Automatic token refresh on app load
✅ Automatic logout on token expiration
✅ HTTPS ready (configure in production)

### Recommended for Production
- [ ] Implement refresh tokens
- [ ] Add rate limiting on auth endpoints
- [ ] Enable CORS with specific origins
- [ ] Use secure HTTP-only cookies for tokens
- [ ] Implement password reset flow
- [ ] Add two-factor authentication (2FA)
- [ ] Log authentication attempts
- [ ] Implement account lockout after failed attempts

## Testing Authentication

### Manual Testing

1. **Login Flow**:
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```

2. **Protected Request**:
   ```bash
   curl -X GET http://localhost:4000/api/v1/inspections \
     -H "Authorization: Bearer <your-token>"
   ```

3. **Test Token Expiration**:
   - Use an expired or invalid token
   - Should receive 401 Unauthorized
   - Frontend should auto-logout and redirect to login

### Testing in Browser

1. Open DevTools → Application → Local Storage
2. View/modify the `token` value
3. Refresh page to see token validation
4. Clear token to test unauthorized access

## Troubleshooting

### Common Issues

**Issue**: User gets logged out immediately after login
- **Cause**: Backend `/api/v1/auth/me` endpoint is failing
- **Solution**: Check backend logs and ensure endpoint is accessible

**Issue**: Token not being sent with requests
- **Cause**: Redux store not properly configured
- **Solution**: Verify Redux store includes auth reducer and middleware

**Issue**: 403 Forbidden on protected routes
- **Cause**: User doesn't have required role
- **Solution**: Check user role in backend database and frontend Redux store

**Issue**: Token persists but user data is lost on refresh
- **Cause**: `getCurrentUser` API call is failing
- **Solution**: Check network tab and backend logs for errors

## Development Tips

### View Current Token
```typescript
// In browser console
localStorage.getItem('token')
```

### Decode JWT Token
Use [jwt.io](https://jwt.io) to decode and inspect token payload

### Force Logout
```typescript
// In browser console
localStorage.removeItem('token')
window.location.reload()
```

### Test Different Roles
Create multiple user accounts with different roles to test RBAC

## Related Files

### Frontend
- `src/services/api.ts` - API configuration and auth interceptor
- `src/features/auth/authSlice.ts` - Auth state management
- `src/features/auth/authApi.ts` - Auth API endpoints
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/components/Layout.tsx` - Token validation on mount

### Backend
- `src/features/auth/auth.middleware.ts` - Auth middleware
- `src/features/auth/auth.utils.ts` - JWT utilities
- `src/features/auth/auth.service.ts` - Auth business logic
- `src/features/auth/auth.types.ts` - Auth types and DTOs


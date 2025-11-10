# Authentication API

This module provides comprehensive authentication and authorization functionality for the TurbineOps Lite application.

## Features

- User registration with role-based access control
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes with middleware
- Role-based authorization (ADMIN, ENGINEER, VIEWER)
- Profile management
- Password change functionality

## API Endpoints

### 1. Register User

**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "VIEWER"  // Optional: ADMIN, ENGINEER, or VIEWER (default: VIEWER)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Login

**POST** `/api/v1/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 3. Get Profile

**GET** `/api/v1/auth/profile`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER"
  }
}
```

### 4. Update Profile

**PATCH** `/api/v1/auth/profile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Smith",
    "role": "VIEWER"
  }
}
```

### 5. Change Password

**POST** `/api/v1/auth/change-password`

Change the current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

## Authentication Middleware

### `authenticate`

Verifies the JWT token and attaches user information to the request.

**Usage:**
```typescript
import { authenticate } from '../auth/auth.middleware';

router.get('/protected-route', authenticate, controller.method);
```

### `authorize`

Restricts access based on user roles.

**Usage:**
```typescript
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '../auth/auth.types';

// Only ADMIN can access
router.delete('/resource/:id', 
  authenticate, 
  authorize(Role.ADMIN), 
  controller.delete
);

// ADMIN or ENGINEER can access
router.post('/resource', 
  authenticate, 
  authorize(Role.ADMIN, Role.ENGINEER), 
  controller.create
);
```

## User Roles

The system supports three user roles with different permission levels:

### VIEWER
- Read-only access
- Can view turbines, inspections, and reports
- Cannot create, update, or delete resources

### ENGINEER
- Read and write access
- Can create and update turbines, inspections, and repair plans
- Cannot delete resources or manage users

### ADMIN
- Full access
- Can perform all CRUD operations
- Can manage users and system settings

## Environment Variables

Add these to your `.env` file:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d  # Token expiration time
```

## Security Best Practices

1. **Always use HTTPS in production** - JWT tokens should never be transmitted over unsecured connections
2. **Store tokens securely** - Use httpOnly cookies or secure storage mechanisms
3. **Implement token refresh** - Consider adding refresh token functionality for better UX
4. **Rate limiting** - Add rate limiting to prevent brute force attacks
5. **Password requirements** - Enforce strong password policies (minimum 8 characters)
6. **Token blacklisting** - Consider implementing token blacklisting for logout functionality

## Example Usage with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "engineer@example.com",
    "password": "password123",
    "name": "Jane Engineer",
    "role": "ENGINEER"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "engineer@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile
```bash
curl -X PATCH http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Senior Engineer"
  }'
```

### Change Password
```bash
curl -X POST http://localhost:4000/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

## Frontend Integration

The frontend already has RTK Query API endpoints defined. Example usage:

```typescript
import { useLoginMutation, useGetProfileQuery } from '@/features/auth/authApi';

// Login
const [login, { isLoading }] = useLoginMutation();
const result = await login({ email, password }).unwrap();
localStorage.setItem('token', result.data.token);

// Get Profile
const { data: profile } = useGetProfileQuery();
```

## Testing

Run tests for the auth module:

```bash
npm test -- auth
```

## Architecture

```
auth/
├── auth.types.ts        # TypeScript types and DTOs
├── auth.repository.ts   # Database operations
├── auth.service.ts      # Business logic
├── auth.controller.ts   # HTTP handlers
├── auth.routes.ts       # Route definitions
├── auth.middleware.ts   # Authentication & authorization middleware
├── auth.utils.ts        # JWT and password utilities
└── README.md           # This file
```

## Error Handling

All authentication errors are handled consistently:

- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Invalid credentials or expired token
- **403 Forbidden** - Insufficient permissions
- **409 Conflict** - Resource already exists (e.g., email already registered)
- **404 Not Found** - User not found
- **500 Internal Server Error** - Server error

## Notes

- Passwords are hashed using bcrypt with a salt rounds of 10
- JWT tokens expire after 7 days (configurable)
- The system automatically validates email formats and password strength
- All routes except login and register require authentication


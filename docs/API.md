# API Documentation

## REST (OpenAPI)

- Swagger UI at: `http://localhost:4000/api/docs`
- Spec: `backend/openapi.yaml`
- Base URL: `http://localhost:4000/api/v1`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Public Endpoints (No Authentication Required)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /turbines` - List all turbines
- `GET /turbines/:id` - Get turbine by ID

#### Protected Endpoints (Authentication Required)

##### Authentication Endpoints

- `GET /auth/profile` - Get current user profile
- `PATCH /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password

##### Turbine Endpoints

- `POST /turbines` - Create turbine (ADMIN, ENGINEER only)
- `PATCH /turbines/:id` - Update turbine (ADMIN, ENGINEER only)
- `DELETE /turbines/:id` - Delete turbine (ADMIN only)

##### Inspection Endpoints

- `POST /inspections/search` - List/filter inspections (ADMIN, ENGINEER only)
  - Request Body (all optional):
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10, max: 100)
    - `startDate` - Filter by inspection date >= startDate (ISO 8601 format)
    - `endDate` - Filter by inspection date <= endDate (ISO 8601 format)
    - `turbineId` - Filter by specific turbine ID
    - `dataSource` - Filter by data source (DRONE or MANUAL)
    - `searchNotes` - Text search in findings notes (case-insensitive)
  - Example Request:
    ```json
    {
      "page": 1,
      "limit": 20,
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "turbineId": "clxyz123",
      "dataSource": "DRONE",
      "searchNotes": "crack"
    }
    ```
- `GET /inspections/:id` - Get inspection by ID (ADMIN, ENGINEER only)
- `POST /inspections` - Create inspection (ADMIN, ENGINEER only)
- `PATCH /inspections/:id` - Update inspection (ADMIN, ENGINEER only)
- `DELETE /inspections/:id` - Delete inspection (ADMIN only)

### User Roles

- **VIEWER** - Read-only access
- **ENGINEER** - Can create and update resources
- **ADMIN** - Full access including delete operations

For detailed authentication documentation, see: `backend/src/features/auth/README.md`

## GraphQL

- Endpoint: `http://localhost:4000/graphql`
- SDL: `backend/src/graphql/schema.graphql`
- Example query:

```graphql
query Example($id: ID!) {
  inspection(id: $id) {
    id
    date
    turbine {
      id
      name
    }
    findings {
      id
      category
      severity
      estimatedCost
      notes
    }
    repairPlan {
      id
      priority
      totalEstimatedCost
      createdAt
    }
  }
}
```

## Domain-driven Architecture

backend/src/
├── index.ts # App entry point
├── app.ts # Express app configuration
├── server.ts # Server startup
│
├── config/ # All configuration
│ ├── database.ts # Database connections (Prisma, Mongo, etc.)
│ ├── env.ts # Environment variables validation
│ ├── swagger.ts # API documentation
│ └── logger.ts # Logging configuration
│
├── common/ # Shared utilities
│ ├── middleware/
│ │ ├── error-handler.ts
│ │ ├── auth.ts
│ │ ├── validation.ts
│ │ └── rate-limit.ts
│ ├── utils/
│ │ ├── response.ts # Standard response helpers
│ │ └── async-handler.ts # Async error wrapper
│ └── types/
│ └── index.ts # Shared TypeScript types
│
├── features/ # Feature modules (Domain-driven)
│ ├── auth/
│ │ ├── auth.controller.ts # HTTP handlers
│ │ ├── auth.service.ts # Business logic
│ │ ├── auth.repository.ts # Data access layer
│ │ ├── auth.routes.ts # Route definitions
│ │ ├── auth.middleware.ts # Authentication middleware
│ │ ├── auth.utils.ts # JWT and password utilities
│ │ ├── auth.types.ts # Feature-specific types
│ │ └── README.md # Auth documentation
│ │
│ ├── turbines/
│ │ ├── turbine.controller.ts # HTTP handlers
│ │ ├── turbine.service.ts # Business logic
│ │ ├── turbine.repository.ts # Data access layer
│ │ ├── turbine.routes.ts # Route definitions
│ │ ├── turbine.validation.ts # Input validation schemas
│ │ ├── turbine.types.ts # Feature-specific types
│ │ └── **tests**/
│ │ └── turbine.test.ts
│ │
│ ├── inspections/
│ │ ├── inspection.controller.ts
│ │ ├── inspection.service.ts
│ │ ├── inspection.repository.ts
│ │ ├── inspection.routes.ts
│ │ ├── inspection.validation.ts
│ │ └── **tests**/
│ │
│ ├── repair-plans/
│ │ ├── repair-plan.controller.ts
│ │ ├── repair-plan.service.ts
│ │ ├── repair-plan.repository.ts
│ │ ├── repair-plan.routes.ts
│ │ ├── repair-plan.validation.ts
│ │ ├── rules/ # Domain-specific rules
│ │ │ └── severity-rules.ts
│ │ └── **tests**/
│ │
│ └── notifications/
│ ├── notification.controller.ts
│ ├── notification.service.ts # SSE management
│ └── notification.routes.ts
│
├── graphql/ # GraphQL (if using)
│ ├── schema.graphql
│ ├── resolvers/
│ │ ├── index.ts
│ │ ├── inspection.resolver.ts
│ │ └── repair-plan.resolver.ts
│ └── server.ts
│
└── database/
├── prisma/
│ └── schema.prisma
├── migrations/
└── seeds/
└── seed.ts

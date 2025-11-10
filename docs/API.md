# API Documentation

## REST (OpenAPI)

- Swagger UI at: `http://localhost:4000/api/docs`
- Spec: `backend/openapi.yaml`

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
├── index.ts                      # App entry point
├── app.ts                        # Express app configuration
├── server.ts                     # Server startup
│
├── config/                       # All configuration
│   ├── database.ts              # Database connections (Prisma, Mongo, etc.)
│   ├── env.ts                   # Environment variables validation
│   ├── swagger.ts               # API documentation
│   └── logger.ts                # Logging configuration
│
├── common/                       # Shared utilities
│   ├── middleware/
│   │   ├── error-handler.ts
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── rate-limit.ts
│   ├── utils/
│   │   ├── response.ts          # Standard response helpers
│   │   └── async-handler.ts     # Async error wrapper
│   └── types/
│       └── index.ts              # Shared TypeScript types
│
├── features/                     # Feature modules (Domain-driven)
│   ├── turbines/
│   │   ├── turbine.controller.ts    # HTTP handlers
│   │   ├── turbine.service.ts       # Business logic
│   │   ├── turbine.repository.ts    # Data access layer
│   │   ├── turbine.routes.ts        # Route definitions
│   │   ├── turbine.validation.ts    # Input validation schemas
│   │   ├── turbine.types.ts         # Feature-specific types
│   │   └── __tests__/
│   │       └── turbine.test.ts
│   │
│   ├── inspections/
│   │   ├── inspection.controller.ts
│   │   ├── inspection.service.ts
│   │   ├── inspection.repository.ts
│   │   ├── inspection.routes.ts
│   │   ├── inspection.validation.ts
│   │   └── __tests__/
│   │
│   ├── repair-plans/
│   │   ├── repair-plan.controller.ts
│   │   ├── repair-plan.service.ts
│   │   ├── repair-plan.repository.ts
│   │   ├── repair-plan.routes.ts
│   │   ├── repair-plan.validation.ts
│   │   ├── rules/                    # Domain-specific rules
│   │   │   └── severity-rules.ts
│   │   └── __tests__/
│   │
│   └── notifications/
│       ├── notification.controller.ts
│       ├── notification.service.ts   # SSE management
│       └── notification.routes.ts
│
├── graphql/                      # GraphQL (if using)
│   ├── schema.graphql
│   ├── resolvers/
│   │   ├── index.ts
│   │   ├── inspection.resolver.ts
│   │   └── repair-plan.resolver.ts
│   └── server.ts
│
└── database/
    ├── prisma/
    │   └── schema.prisma
    ├── migrations/
    └── seeds/
        └── seed.ts
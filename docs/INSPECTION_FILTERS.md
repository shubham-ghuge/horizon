# Inspection Filtering Feature

## Overview
Added comprehensive filtering capabilities to the inspections endpoint, allowing users to filter inspections by date range, turbine, data source, and search within findings notes.

## Backend Changes

### 1. Types (`backend/src/features/inspections/inspection.types.ts`)
Added `InspectionFilterDto` class with validation:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Items per page
- `startDate` (optional) - Filter inspections from this date
- `endDate` (optional) - Filter inspections until this date
- `turbineId` (optional) - Filter by specific turbine
- `dataSource` (optional) - Filter by DRONE or MANUAL
- `searchNotes` (optional) - Case-insensitive text search in findings notes

### 2. Repository (`backend/src/features/inspections/inspection.repository.ts`)
- Added `buildWhereClause()` private method to construct Prisma where conditions
- Updated `findMany()` to accept filters
- Updated `count()` to accept filters for accurate pagination
- Includes findings in the response for search functionality

### 3. Service (`backend/src/features/inspections/inspection.service.ts`)
- Updated `findAll()` method signature to accept optional filters
- Passes filters to repository methods

### 4. Controller (`backend/src/features/inspections/inspection.controller.ts`)
- Extracts filter parameters from request body
- Separates pagination (`page`, `limit`) from other filters
- Passes structured data to service layer

### 5. Routes (`backend/src/features/inspections/inspection.routes.ts`)
- Changed from GET to POST at `/inspections/search`
- Added `validateDto(InspectionFilterDto)` middleware
- Maintains backward compatibility with separate `/inspections` POST for creating

### 6. Validation Middleware (`backend/src/common/middlewares/validate.ts`)
- Added `validateQuery()` function for query parameter validation
- Supports optional parameters with `skipMissingProperties`

## Frontend Changes

### 1. Types (`frontend/src/types/index.ts`)
Added `InspectionFilters` interface:
```typescript
export interface InspectionFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  turbineId?: string;
  dataSource?: DataSource;
  searchNotes?: string;
}
```

### 2. API (`frontend/src/features/inspections/inspectionApi.ts`)
- Updated `getInspections` mutation to accept `InspectionFilters`
- Sends filters in POST request body to `/api/v1/inspections/search`
- Only includes non-empty filter values in request

### 3. UI Component (`frontend/src/pages/Inspections.tsx`)
Added comprehensive filter UI:
- **Date Range Filter**: Start and end date inputs
- **Turbine Filter**: Dropdown to select specific turbine
- **Data Source Filter**: Dropdown for DRONE/MANUAL
- **Search Notes**: Text input for searching within findings notes
- **Show/Hide Filters**: Toggle button to collapse/expand filter section
- **Clear All Filters**: Button to reset all filters at once
- **Auto-refresh**: Automatically fetches new data when filters change
- **Pagination**: Resets to page 1 when filters change

## API Usage Examples

### 1. Get All Inspections (No Filters)
```bash
POST /api/v1/inspections/search
Content-Type: application/json
Authorization: Bearer <token>

{
  "page": 1,
  "limit": 10
}
```

### 2. Filter by Date Range
```bash
POST /api/v1/inspections/search
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "startDate": "2024-01-01",
  "endDate": "2024-03-31"
}
```

### 3. Filter by Turbine and Data Source
```bash
POST /api/v1/inspections/search
Content-Type: application/json

{
  "page": 1,
  "limit": 20,
  "turbineId": "clxyz123",
  "dataSource": "DRONE"
}
```

### 4. Search in Findings Notes
```bash
POST /api/v1/inspections/search
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "searchNotes": "crack"
}
```

### 5. Combined Filters
```bash
POST /api/v1/inspections/search
Content-Type: application/json

{
  "page": 1,
  "limit": 20,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "turbineId": "clxyz123",
  "dataSource": "MANUAL",
  "searchNotes": "blade damage"
}
```

## Features

### Backend
✅ Date range filtering (inclusive)
✅ Turbine ID filtering (exact match)
✅ Data source filtering (DRONE/MANUAL)
✅ Case-insensitive text search in findings notes
✅ Pagination with total count
✅ Validation with class-validator
✅ Type-safe with TypeScript
✅ Efficient database queries with Prisma

### Frontend
✅ Collapsible filter panel
✅ Date range pickers
✅ Turbine dropdown (populated from API)
✅ Data source dropdown
✅ Notes search input
✅ Clear all filters button
✅ Auto-refresh on filter changes
✅ Loading states
✅ Error handling
✅ Responsive design

## Performance Considerations

1. **Database Indexes**: Consider adding indexes on:
   - `inspection.date` for date range queries
   - `inspection.turbineId` for turbine filtering
   - `inspection.dataSource` for source filtering
   - `finding.notes` for text search (using GIN index for PostgreSQL)

2. **Query Optimization**: 
   - Filters are applied at the database level (WHERE clause)
   - Pagination prevents loading all records
   - Includes only necessary relations

3. **Frontend Optimization**:
   - Debouncing on search input (can be added)
   - Caching with RTK Query
   - Optimistic updates on create/delete

## Future Enhancements

- [ ] Add debouncing to search input (delay API call)
- [ ] Add finding category filter
- [ ] Add severity range filter
- [ ] Export filtered results to CSV
- [ ] Save filter presets
- [ ] URL query parameters for shareable filtered views
- [ ] Advanced search with multiple finding criteria

## Testing

To test the filtering functionality:

1. **Backend**: Run the development server
   ```bash
   cd backend && npm run dev
   ```

2. **Frontend**: Run the development server
   ```bash
   cd frontend && npm run dev
   ```

3. **Create Test Data**: Use the UI or API to create inspections with various:
   - Different dates
   - Different turbines
   - Different data sources (DRONE/MANUAL)
   - Findings with different notes

4. **Test Each Filter**:
   - Date range: Select start and end dates
   - Turbine: Select different turbines from dropdown
   - Data source: Toggle between DRONE and MANUAL
   - Search: Enter keywords that appear in findings notes
   - Combined: Use multiple filters together

## Documentation

- API documentation: `docs/API.md`
- Architecture: `docs/ARCHITECTURE.md`
- This guide: `docs/INSPECTION_FILTERS.md`


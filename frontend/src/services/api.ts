import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:4000',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux store
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Turbine', 'Inspection', 'Finding', 'RepairPlan'],
  endpoints: () => ({}),
});

import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { pushNotification } from '../features/notifications/notificationsSlice';

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

// Enhanced base query with auth error handling
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle authentication errors
  if (result.error) {
    if (result.error.status === 401 || result.error.status === 403) {
      // Clear auth state without importing to avoid circular dependency
      localStorage.removeItem('token');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      // Dispatch a global error notification for other server/client errors
      const anyErr = result.error as any;
      let message = 'An unexpected error occurred';
      if (typeof anyErr?.data === 'string') {
        message = anyErr.data;
      } else if (anyErr?.data?.message) {
        message = anyErr.data.message as string;
      } else if (anyErr?.error) {
        message = anyErr.error as string;
      } else if (anyErr?.status) {
        message = `Request failed with status ${anyErr.status}`;
      }
      // Best-effort title by status code
      const title =
        anyErr?.status && typeof anyErr.status === 'number'
          ? `${anyErr.status >= 500 ? 'Server' : 'Request'} error (${anyErr.status})`
          : 'Request error';
      api.dispatch(
        pushNotification({
          type: 'error',
          title,
          message,
        })
      );
    }
  }

  return result;
};

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Turbine', 'Inspection', 'Finding', 'RepairPlan'],
  endpoints: () => ({}),
});

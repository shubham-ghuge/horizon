import { api } from '../../services/api';
import { User, LoginRequest, LoginResponse, ApiResponse } from '../../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/api/v1/auth/profile',
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ['User'],
    }),

    register: builder.mutation<
      LoginResponse,
      { email: string; password: string; name: string }
    >({
      query: (data) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRegisterMutation,
} = authApi;

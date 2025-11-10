import { api } from '../../services/api';
import { User, LoginRequest, LoginResponse } from '../../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
      query: () => '/api/v1/auth/me',
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
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRegisterMutation,
} = authApi;

import { api } from '../../services/api';
import {
  Turbine,
  CreateTurbineRequest,
  ApiResponse,
  TurbinesResponse,
} from '../../types';

export const turbinesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTurbines: builder.query<
      ApiResponse<TurbinesResponse>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/api/v1/turbines',
        params: params || undefined,
      }),
      providesTags: (result) => {
        const items = result?.data?.turbines || [];
        return [
          { type: 'Turbine' as const, id: 'LIST' },
          ...items.map((turbine) => ({
            type: 'Turbine' as const,
            id: turbine.id,
          })),
        ];
      },
    }),

    getTurbineById: builder.query<Turbine, string>({
      query: (id) => `/api/v1/turbines/${id}`,
      providesTags: (result, error, id) => [{ type: 'Turbine', id }],
    }),

    createTurbine: builder.mutation<Turbine, CreateTurbineRequest>({
      query: (body) => ({
        url: '/api/v1/turbines',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Turbine', id: 'LIST' }],
    }),

    updateTurbine: builder.mutation<
      Turbine,
      { id: string; data: Partial<CreateTurbineRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/turbines/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Turbine', id },
        { type: 'Turbine', id: 'LIST' },
      ],
    }),

    deleteTurbine: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/turbines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Turbine', id },
        { type: 'Turbine', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTurbinesQuery,
  useGetTurbineByIdQuery,
  useCreateTurbineMutation,
  useUpdateTurbineMutation,
  useDeleteTurbineMutation,
} = turbinesApi;

import { api } from '../../services/api';
import { Turbine, CreateTurbineRequest } from '../../types';

export const turbinesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTurbines: builder.query<Turbine[], void>({
      query: () => '/api/v1/turbines',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Turbine' as const, id })),
              { type: 'Turbine', id: 'LIST' },
            ]
          : [{ type: 'Turbine', id: 'LIST' }],
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

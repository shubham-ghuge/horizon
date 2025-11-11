import { api } from '../../services/api';
import {
  Inspection,
  CreateInspectionRequest,
  InspectionsResponse,
  ApiResponse,
} from '../../types';

export const inspectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query<
      ApiResponse<InspectionsResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/api/v1/inspections',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.data?.data.map(({ id }) => ({
          type: 'Inspection' as const,
          id,
        })) || [],
    }),

    getInspectionById: builder.query<Inspection, string>({
      query: (id) => `/api/v1/inspections/${id}`,
      providesTags: (result, error, id) => [{ type: 'Inspection', id }],
    }),

    createInspection: builder.mutation<Inspection, CreateInspectionRequest>({
      query: (body) => ({
        url: '/api/v1/inspections',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Inspection', id: 'LIST' }],
    }),

    updateInspection: builder.mutation<
      Inspection,
      { id: string; data: Partial<CreateInspectionRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/inspections/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inspection', id },
        { type: 'Inspection', id: 'LIST' },
      ],
    }),

    deleteInspection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/inspections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Inspection', id },
        { type: 'Inspection', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetInspectionsQuery,
  useGetInspectionByIdQuery,
  useCreateInspectionMutation,
  useUpdateInspectionMutation,
  useDeleteInspectionMutation,
} = inspectionsApi;

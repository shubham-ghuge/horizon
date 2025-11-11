import { api } from '../../services/api';
import {
  Inspection,
  CreateInspectionRequest,
  InspectionsResponse,
  ApiResponse,
  InspectionFilters,
} from '../../types';

export const inspectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query<ApiResponse<InspectionsResponse>, InspectionFilters>({
      query: (filters) => ({
        url: '/api/v1/inspections/search',
        method: 'POST',
        body: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.turbineId && { turbineId: filters.turbineId }),
          ...(filters.dataSource && { dataSource: filters.dataSource }),
          ...(filters.searchNotes && { searchNotes: filters.searchNotes }),
        },
      }),
      providesTags: (result) => {
        const inspections =
          result?.data?.data && Array.isArray(result.data.data)
            ? result.data.data
            : [];
        return [
          { type: 'Inspection' as const, id: 'LIST' },
          ...inspections.map((i) => ({ type: 'Inspection' as const, id: i.id })),
        ];
      },
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

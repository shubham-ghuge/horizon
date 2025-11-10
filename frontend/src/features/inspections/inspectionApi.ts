import { api } from '../../services/api';
import { Inspection, CreateInspectionRequest, Finding } from '../../types';

export const inspectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query<Inspection[], { turbineId?: string }>({
      query: ({ turbineId }) => ({
        url: '/api/v1/inspections',
        params: turbineId ? { turbineId } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Inspection' as const, id })),
              { type: 'Inspection', id: 'LIST' },
            ]
          : [{ type: 'Inspection', id: 'LIST' }],
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

    getInspectionFindings: builder.query<Finding[], string>({
      query: (inspectionId) => `/api/v1/inspections/${inspectionId}/findings`,
      providesTags: (result, error, inspectionId) => [
        { type: 'Finding', id: inspectionId },
      ],
    }),
  }),
});

export const {
  useGetInspectionsQuery,
  useGetInspectionByIdQuery,
  useCreateInspectionMutation,
  useDeleteInspectionMutation,
  useGetInspectionFindingsQuery,
} = inspectionsApi;

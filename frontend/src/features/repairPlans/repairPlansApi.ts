import { api } from '../../services/api';
import { RepairPlan } from '../../types';

export const repairPlansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRepairPlans: builder.query<
      {
        data: RepairPlan[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/api/v1/repair-plans/search',
        method: 'POST',
        body: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: (result) => {
        const items = result?.data || [];
        return [
          { type: 'RepairPlan' as const, id: 'LIST' },
          ...items.map((plan) => ({ type: 'RepairPlan' as const, id: plan.id })),
        ];
      },
      transformResponse: (response: { success: boolean; data?: any }) => {
        // Backend returns { success, data: { data: [], meta: {} } }
        const payload = (response?.data ?? {}) as {
          data?: RepairPlan[];
          meta?: { page: number; limit: number; total: number; totalPages: number };
        };
        return {
          data: payload.data ?? [],
          meta: payload.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      },
    }),

    getRepairPlanById: builder.query<RepairPlan, string>({
      query: (id) => `/api/v1/repair-plans/${id}`,
      providesTags: (result, error, id) => [{ type: 'RepairPlan', id }],
    }),

    getRepairPlanByInspectionId: builder.query<RepairPlan, string>({
      query: (inspectionId) =>
        `/api/v1/inspections/${inspectionId}/repair-plan`,
      providesTags: (result, error, inspectionId) => [
        { type: 'RepairPlan', id: inspectionId },
      ],
    }),

    generateRepairPlan: builder.mutation<RepairPlan, string>({
      query: (inspectionId) => ({
        url: `/api/v1/inspections/${inspectionId}/repair-plan`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, inspectionId) => [
        { type: 'RepairPlan', id: inspectionId },
        { type: 'RepairPlan', id: 'LIST' },
        { type: 'Inspection', id: inspectionId },
      ],
    }),
  }),
});

export const {
  useGetRepairPlansQuery,
  useGetRepairPlanByIdQuery,
  useGetRepairPlanByInspectionIdQuery,
  useGenerateRepairPlanMutation,
} = repairPlansApi;

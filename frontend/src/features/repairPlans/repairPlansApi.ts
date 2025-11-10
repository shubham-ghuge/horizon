import { api } from '../../services/api';
import { RepairPlan } from '../../types';

export const repairPlansApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRepairPlans: builder.query<RepairPlan[], void>({
      query: () => '/api/v1/repair-plans',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RepairPlan' as const, id })),
              { type: 'RepairPlan', id: 'LIST' },
            ]
          : [{ type: 'RepairPlan', id: 'LIST' }],
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

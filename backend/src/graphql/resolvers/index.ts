import { prisma } from '../../config/prisma';
import { repairPlanService } from '../../features/repair-plans/repair-plan.service';

export const resolvers = {
  Query: {
    inspection: async (_: any, { id }: any) =>
      prisma.inspection.findUnique({
        where: { id },
        include: { turbine: true, findings: true, repairPlan: true },
      }),

    repairPlan: async (_: any, { inspectionId }: any) =>
      prisma.repairPlan.findUnique({ where: { inspectionId } }),
  },

  Mutation: {
    generateRepairPlan: async (_: any, { inspectionId }: any) => {
      return await repairPlanService.generateRepairPlan(inspectionId);
    },
  },
};

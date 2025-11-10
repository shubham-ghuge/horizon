import { repairPlanRepository } from './repair-plan.repository';

export class RepairPlanService {
  async findAll(options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;

    const [turbines, total] = await Promise.all([
      repairPlanRepository.findMany({ skip, take: options.limit }),
      repairPlanRepository.count(),
    ]);

    return {
      data: turbines,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async generateRepairPlan(inspectionId: string): Promise<any> {
    return null;
  }
}

export const repairPlanService = new RepairPlanService();

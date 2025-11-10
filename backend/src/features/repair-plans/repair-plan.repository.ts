import { prisma } from '../../config/prisma';
import { CreateRepairPlanDto, UpdateRepairPlanDto } from './repair-plan.types';

export class RepairPlanRepository {
  async findMany(options: { skip?: number; take?: number }) {
    return prisma.repairPlan.findMany({
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.repairPlan.findUnique({
      where: { id },
      include: {
        inspection: {},
      },
    });
  }

  async update(id: string, data: UpdateRepairPlanDto) {
    return prisma.turbine.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.repairPlan.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.repairPlan.count();
  }
}

export const repairPlanRepository = new RepairPlanRepository();

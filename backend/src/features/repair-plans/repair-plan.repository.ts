import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateRepairPlanDto,
  UpdateRepairPlanDto,
  RepairPlanFilterDto,
} from './repair-plan.types';

export class RepairPlanRepository {
  private buildWhereClause(
    filters?: RepairPlanFilterDto
  ): Prisma.RepairPlanWhereInput {
    if (!filters) return {};
 
    const where: Prisma.RepairPlanWhereInput = {};
 
    if (filters.priority) {
      where.priority = filters.priority as any;
    }
 
    if (
      filters.minTotalEstimatedCost !== undefined ||
      filters.maxTotalEstimatedCost !== undefined
    ) {
      where.totalEstimatedCost = {};
      if (filters.minTotalEstimatedCost !== undefined) {
        where.totalEstimatedCost.gte = Number(filters.minTotalEstimatedCost);
      }
      if (filters.maxTotalEstimatedCost !== undefined) {
        where.totalEstimatedCost.lte = Number(filters.maxTotalEstimatedCost);
      }
    }
 
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }
 
    if (filters.turbineId) {
      where.inspection = { turbineId: filters.turbineId };
    }
 
    return where;
  }
 
  async findMany(options: {
    skip?: number;
    take?: number;
    filters?: RepairPlanFilterDto;
  }) {
    const where = this.buildWhereClause(options.filters);
 
    return prisma.repairPlan.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
      include: {
        inspection: {
          include: {
            turbine: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.repairPlan.findUnique({
      where: { id },
      include: {
        inspection: {
          include: {
            turbine: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateRepairPlanDto) {
    return prisma.repairPlan.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.repairPlan.delete({
      where: { id },
    });
  }

  async count(filters?: RepairPlanFilterDto) {
    const where = this.buildWhereClause(filters);
    return prisma.repairPlan.count({ where });
  }
}

export const repairPlanRepository = new RepairPlanRepository();

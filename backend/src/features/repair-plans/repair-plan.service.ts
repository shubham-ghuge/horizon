import { prisma } from '../../config/prisma';
import { repairPlanRepository } from './repair-plan.repository';
import { broadcastEvent } from '../notifications/sse';
import { RepairPlanFilterDto } from './repair-plan.types';

export class RepairPlanService {
  async findAll(options: {
    page: number;
    limit: number;
    filters?: RepairPlanFilterDto;
  }) {
    const skip = (options.page - 1) * options.limit;

    const [plans, total] = await Promise.all([
      repairPlanRepository.findMany({
        skip,
        take: options.limit,
        filters: options.filters,
      }),
      repairPlanRepository.count(options.filters),
    ]);

    return {
      data: plans,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async generateRepairPlan(inspectionId: string): Promise<any> {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      include: { findings: true },
    });

    if (!inspection) {
      throw new Error('Inspection not found');
    }

    // Adjust severities per rule: BLADE_DAMAGE + notes include "crack" => min severity 4
    const adjustedFindings = inspection.findings.map((f) => {
      const hasCrack = (f.notes ?? '')
        .toString()
        .toLowerCase()
        .includes('crack');
      const severity =
        f.category === 'BLADE_DAMAGE' && hasCrack
          ? Math.max(4, f.severity)
          : f.severity;
      return {
        id: f.id,
        category: f.category,
        severity,
        estimatedCost: Number(f.estimatedCost ?? 0),
        notes: f.notes ?? null,
      };
    });

    const totalEstimatedCost = adjustedFindings.reduce(
      (sum, f) => sum + Number(f.estimatedCost || 0),
      0
    );

    const maxSeverity = adjustedFindings.reduce(
      (max, f) => (f.severity > max ? f.severity : max),
      0
    );

    const priority =
      maxSeverity >= 5 ? 'HIGH' : maxSeverity >= 3 ? 'MEDIUM' : 'LOW';

    const plan = await prisma.repairPlan.upsert({
      where: { inspectionId },
      update: {
        priority: priority as any,
        totalEstimatedCost,
        snapshotJson: adjustedFindings,
      },
      create: {
        inspectionId,
        priority: priority as any,
        totalEstimatedCost,
        snapshotJson: adjustedFindings,
      },
    });

    // Broadcast realtime notification
    broadcastEvent('repair-plan.created', {
      inspectionId,
      plan: {
        id: plan.id,
        priority: plan.priority,
        totalEstimatedCost: plan.totalEstimatedCost,
        createdAt: plan.createdAt,
      },
    });

    return plan;
  }
}

export const repairPlanService = new RepairPlanService();

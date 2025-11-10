import { DataSource } from '@prisma/client';
import { AppError } from '../../common/middlewares/error-handler';
import { prisma } from '../../config/prisma';
import { turbineService } from '../turbines/turbine.service';
import {
  CreateInspectionDto,
  FindingDto,
  UpdateInspectionDto,
} from './inspection.types';

export class InspectionRepository {
  async findMany(options: { skip?: number; take?: number }) {
    return prisma.inspection.findMany({
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

  async create(data: CreateInspectionDto) {
    const turbine = turbineService.findById(data.turbineId);
    if (!turbine) {
      throw new AppError('Turbine not found', 404);
    }
    // create inspection
    const inspection = await prisma.inspection.create({
      data: {
        turbineId: data.turbineId,
        date: data.date,
        dataSource: data.dataSource as DataSource,
        rawPackageUrl: data.recordingUrl,
      },
    });
    // create findings
    const findings = await prisma.finding.createMany({
      data: data.findings.map((finding: FindingDto) => ({
        inspectionId: inspection.id,
        category: finding.category,
        severity: finding.severity,
        estimatedCost: finding.estimatedCost,
        notes: finding.notes,
      })),
    });

    return inspection;
  }

  async update(id: string, data: UpdateInspectionDto) {
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

export const inspectionRepository = new InspectionRepository();

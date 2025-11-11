import { prisma } from '../../config/prisma';
import {
  CreateInspectionDto,
  UpdateInspectionDto,
  InspectionFilterDto,
} from './inspection.types';
import { Prisma } from '@prisma/client';

export class InspectionRepository {
  private buildWhereClause(filters?: InspectionFilterDto): Prisma.InspectionWhereInput {
    if (!filters) return {};

    const where: Prisma.InspectionWhereInput = {};

    // Date range filter
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    // Turbine filter
    if (filters.turbineId) {
      where.turbineId = filters.turbineId;
    }

    // Data source filter
    if (filters.dataSource) {
      where.dataSource = filters.dataSource;
    }

    // Text search on findings notes
    if (filters.searchNotes) {
      where.findings = {
        some: {
          notes: {
            contains: filters.searchNotes,
            mode: 'insensitive',
          },
        },
      };
    }

    return where;
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    filters?: InspectionFilterDto;
  }) {
    const where = this.buildWhereClause(options.filters);

    return prisma.inspection.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
      include: {
        turbine: {
          select: {
            id: true,
            name: true,
          },
        },
        findings: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.inspection.findUnique({
      where: { id },
      include: {
        turbine: {
          select: {
            id: true,
            name: true,
          },
        },
        findings: true,
      },
    });
  }

  async create(data: CreateInspectionDto) {
    return prisma.inspection.create({
      data: {
        turbineId: data.turbineId,
        date: new Date(data.date),
        inspectorName: data.inspectorName,
        dataSource: data.dataSource,
        rawPackageUrl: data.rawPackageUrl,
        findings: {
          create: data.findings.map((finding) => ({
            category: finding.category,
            severity: finding.severity,
            estimatedCost: finding.estimatedCost,
            notes: finding.notes,
          })),
        },
      },
      include: {
        findings: true,
      },
    });
  }

  async update(id: string, data: UpdateInspectionDto) {
    // If findings are provided, we need to delete old ones and create new ones in a transaction
    if (data.findings) {
      const findings = data.findings;
      return prisma.$transaction(async (tx) => {
        // Delete existing findings
        await tx.finding.deleteMany({
          where: { inspectionId: id },
        });

        // Update inspection with new findings
        return tx.inspection.update({
          where: { id },
          data: {
            ...(data.date && { date: new Date(data.date) }),
            ...(data.inspectorName && { inspectorName: data.inspectorName }),
            ...(data.dataSource && { dataSource: data.dataSource }),
            ...(data.rawPackageUrl !== undefined && {
              rawPackageUrl: data.rawPackageUrl,
            }),
            findings: {
              create: findings.map((finding) => ({
                category: finding.category,
                severity: finding.severity,
                estimatedCost: finding.estimatedCost,
                notes: finding.notes,
              })),
            },
          },
          include: {
            findings: true,
          },
        });
      });
    }

    // If no findings provided, just update the inspection fields
    return prisma.inspection.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.inspectorName && { inspectorName: data.inspectorName }),
        ...(data.dataSource && { dataSource: data.dataSource }),
        ...(data.rawPackageUrl !== undefined && {
          rawPackageUrl: data.rawPackageUrl,
        }),
      },
      include: {
        findings: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.inspection.delete({
      where: { id },
    });
  }

  async count(filters?: InspectionFilterDto) {
    const where = this.buildWhereClause(filters);
    return prisma.inspection.count({ where });
  }
}

export const inspectionRepository = new InspectionRepository();

import { AppError } from '../../common/middlewares/error-handler';
import { inspectionRepository } from './inspection.repository';
import {
  CreateInspectionDto,
  UpdateInspectionDto,
  InspectionFilterDto,
} from './inspection.types';
import { turbineRepository } from '../turbines/turbine.repository';
import { Prisma } from '@prisma/client';
import { repairPlanService } from '../repair-plans/repair-plan.service';

export class InspectionService {
  async findAll(options: {
    page: number;
    limit: number;
    filters?: InspectionFilterDto;
  }) {
    const skip = (options.page - 1) * options.limit;

    const [data, total] = await Promise.all([
      inspectionRepository.findMany({
        skip,
        take: options.limit,
        filters: options.filters,
      }),
      inspectionRepository.count(options.filters),
    ]);

    return {
      data,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async create(data: CreateInspectionDto) {
    const turbine = await turbineRepository.findById(data.turbineId);
    if (!turbine) throw new AppError('Turbine not found', 404);

    try {
      const inspection = await inspectionRepository.create(data);

      // Generate repair plan after inspection creation (non-blocking failure)
      try {
        await repairPlanService.generateRepairPlan(inspection.id);
      } catch (genErr) {
        // Best-effort; do not block inspection creation on repair plan errors
      }

      return inspection;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new AppError(
          'Inspection already exists for this turbine and date',
          409
        );
      }
      throw err;
    }
  }

  async findById(id: string) {
    const inspection = await inspectionRepository.findById(id);
    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }
    return inspection;
  }

  async update(id: string, data: UpdateInspectionDto) {
    const inspection = await inspectionRepository.findById(id);
    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    return inspectionRepository.update(id, data);
  }

  async delete(id: string) {
    const inspection = await inspectionRepository.findById(id);
    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    return inspectionRepository.delete(id);
  }
}

export const inspectionService = new InspectionService();

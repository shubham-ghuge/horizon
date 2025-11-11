import { AppError } from '../../common/middlewares/error-handler';
import { inspectionRepository } from './inspection.repository';
import {
  CreateInspectionDto,
  UpdateInspectionDto,
  InspectionFilterDto,
} from './inspection.types';
import { turbineRepository } from '../turbines/turbine.repository';

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
    // Check if turbine exists
    const turbine = await turbineRepository.findById(data.turbineId);
    if (!turbine) {
      throw new AppError('Turbine not found', 404);
    }

    // Create inspection with findings
    return inspectionRepository.create(data);
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

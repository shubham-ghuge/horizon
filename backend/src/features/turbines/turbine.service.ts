import { AppError } from '../../common/middlewares/error-handler';
import { turbineRepository } from './turbine.repository';
import { CreateTurbineDto, UpdateTurbineDto } from './turbine.types';

export class TurbineService {
  async findAll(options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;

    const [turbines, total] = await Promise.all([
      turbineRepository.findMany({ skip, take: options.limit }),
      turbineRepository.count(),
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

  async create(data: CreateTurbineDto) {
    const exists = await turbineRepository.findByName(data.name);
    if (exists) {
      throw new AppError('Turbine with this name already exists', 409);
    }

    // Create
    return turbineRepository.create(data);
  }

  async findById(id: string) {
    return turbineRepository.findById(id);
  }

  async update(id: string, data: UpdateTurbineDto) {
    const turbine = await this.findById(id);
    if (!turbine) {
      throw new AppError('Turbine not found', 404);
    }

    return turbineRepository.update(id, data);
  }

  async delete(id: string) {
    return turbineRepository.delete(id);
  }
}

export const turbineService = new TurbineService();

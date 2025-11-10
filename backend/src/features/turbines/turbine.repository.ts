import { prisma } from '../../config/prisma';
import { CreateTurbineDto, UpdateTurbineDto } from './turbine.types';

export class TurbineRepository {
  async findMany(options: { skip?: number; take?: number }) {
    return prisma.turbine.findMany({
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.turbine.findUnique({
      where: { id },
      include: {
        inspections: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.turbine.findFirst({
      where: { name },
    });
  }

  async create(data: CreateTurbineDto) {
    return prisma.turbine.create({
      data,
    });
  }

  async update(id: string, data: UpdateTurbineDto) {
    return prisma.turbine.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.turbine.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.turbine.count();
  }
}

export const turbineRepository = new TurbineRepository();

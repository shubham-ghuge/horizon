import { prisma } from '../../config/prisma';
import { Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
}

export interface UpdateUserData {
  name?: string;
  passwordHash?: string;
}

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

export const authRepository = new AuthRepository();

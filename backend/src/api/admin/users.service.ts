// backend/src/api/admin/users.service.ts
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export const updateUser = async (id: number, data: { name?: string; role?: 'USER' | 'ADMIN' }) => {
  const { name, role } = data;
  const updateData: { name?: string; role?: Role } = {};

  if (name !== undefined) {
    updateData.name = name;
  }
  if (role !== undefined) {
    if (role === 'USER') {
      updateData.role = Role.User;
    } else if (role === 'ADMIN') {
      updateData.role = Role.Admin;
    }
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};

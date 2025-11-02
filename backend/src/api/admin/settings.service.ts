// backend/src/api/admin/settings.service.ts
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSettings = async () => {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, any>);
};

export const updateSettings = async (settings: Record<string, any>) => {
  const updates = Object.entries(settings).map(([key, value]) => {
    return prisma.setting.upsert({
      where: { key },
      update: { value: value as Prisma.InputJsonValue },
      create: { key, value: value as Prisma.InputJsonValue },
    });
  });
  return prisma.$transaction(updates);
};

// backend/src/api/admin/stats.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSummary = async () => {
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const totalUsers = await prisma.user.count();
  const totalLikes = await prisma.like.count();

  return {
    totalPosts,
    totalComments,
    totalUsers,
    totalLikes,
  };
};

export const getTopViewedPosts = async () => {
  return prisma.post.findMany({
    orderBy: {
      viewCount: 'desc',
    },
    take: 5,
    select: {
      id: true,
      title: true,
      viewCount: true,
    },
  });
};

export const getTopLikedPosts = async () => {
  return prisma.post.findMany({
    orderBy: {
      likeCount: 'desc',
    },
    take: 5,
    select: {
      id: true,
      title: true,
      likeCount: true,
    },
  });
};

export const recordVisit = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.visitorStat.upsert({
    where: { date: today },
    update: { count: { increment: 1 } },
    create: { date: today, count: 1 },
  });

  const totalVisitorsSetting = await prisma.setting.findUnique({
    where: { key: 'totalVisitors' },
  });

  const currentTotal =
    totalVisitorsSetting && typeof totalVisitorsSetting.value === 'number'
      ? totalVisitorsSetting.value
      : 0;

  await prisma.setting.upsert({
    where: { key: 'totalVisitors' },
    update: { value: currentTotal + 1 },
    create: { key: 'totalVisitors', value: 1 },
  });
};

export const getVisitorStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStat = await prisma.visitorStat.findUnique({
    where: { date: today },
  });

  const yesterdayStat = await prisma.visitorStat.findUnique({
    where: { date: yesterday },
  });

  const totalVisitorsSetting = await prisma.setting.findUnique({
    where: { key: 'totalVisitors' },
  });

  return {
    dailyVisitors: todayStat?.count ?? 0,
    yesterdayVisitors: yesterdayStat?.count ?? 0,
    totalVisitors:
      totalVisitorsSetting && typeof totalVisitorsSetting.value === 'number'
        ? totalVisitorsSetting.value
        : 0,
  };
};

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

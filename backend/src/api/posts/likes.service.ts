
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likePost = async (postId: number, userId: number) => {
  return prisma.like.create({
    data: {
      postId,
      userId,
    },
  });
};

export const unlikePost = async (postId: number, userId: number) => {
  return prisma.like.deleteMany({
    where: {
      postId,
      userId,
    },
  });
};

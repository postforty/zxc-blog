
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      tags: true,
      comments: {
        include: {
          author: true,
          replies: {
            include: {
              author: true,
            }
          }
        }
      }
    },
  });
};

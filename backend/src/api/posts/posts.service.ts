
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import type { createPostSchema, updatePostSchema } from '../../zod/posts.schema.js';

const prisma = new PrismaClient();

export const createPost = async (postData: z.infer<typeof createPostSchema>) => {
  return prisma.post.create({
    data: postData,
  });
};

export const updatePost = async (id: number, postData: z.infer<typeof updatePostSchema>) => {
  return prisma.post.update({
    where: { id },
    data: postData,
  });
};

export const deletePost = async (id: number) => {
  return prisma.post.delete({
    where: { id },
  });
};

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


import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import type { createCommentSchema, updateCommentSchema } from '../../zod/comments.schema.js';

const prisma = new PrismaClient();

export const createComment = async (commentData: z.infer<typeof createCommentSchema>) => {
  return prisma.comment.create({
    data: commentData,
    include: {
      author: true,
      post: {
        select: {
          title: true,
        },
      },
    },
  });
};

export const updateComment = async (id: number, commentData: z.infer<typeof updateCommentSchema>) => {
  return prisma.comment.update({
    where: { id },
    data: commentData,
    include: {
      author: true,
    },
  });
};

export const deleteComment = async (id: number) => {
  return prisma.comment.delete({
    where: { id },
  });
};

export const getCommentsByPostId = async (postId: number) => {
    return prisma.comment.findMany({
        where: { postId },
        include: {
            author: true,
            post: {
              select: {
                title: true,
              },
            },
        }
    });
};

export const getAllComments = async () => {
  return prisma.comment.findMany({
    include: {
      author: true,
      post: {
        select: {
          title: true,
        },
      },
    },
  });
};

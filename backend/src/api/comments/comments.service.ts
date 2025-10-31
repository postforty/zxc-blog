
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import type { createCommentSchema, updateCommentSchema } from '../../zod/comments.schema.js';

const prisma = new PrismaClient();

export const createComment = async (commentData: z.infer<typeof createCommentSchema>) => {
  return prisma.comment.create({
    data: commentData,
  });
};

export const updateComment = async (id: number, commentData: z.infer<typeof updateCommentSchema>) => {
  return prisma.comment.update({
    where: { id },
    data: commentData,
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
            replies: {
                include: {
                    author: true,
                }
            }
        }
    });
};

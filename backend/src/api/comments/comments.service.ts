
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

export const updateComment = async (id: number, commentData: z.infer<typeof updateCommentSchema>, userId: number) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existingComment) {
    throw new Error('Comment not found');
  }

  if (existingComment.authorId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.comment.update({
    where: { id },
    data: commentData,
    include: {
      author: {
        select: { id: true, name: true },
      },
      replies: {
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      },
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
        where: {
            postId: postId,
            parentId: null, // 최상위 댓글만 가져오기
        },
        include: {
            author: {
                select: { id: true, name: true },
            },
            replies: {
                include: {
                    author: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: 'asc' }, // 답글은 오래된 순서대로
            },
        },
        orderBy: { createdAt: 'desc' }, // 최상위 댓글은 최신 순서대로
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

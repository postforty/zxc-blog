import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleLike = async (postId: number, userId?: number) => {
  if (!userId) {
    // Anonymous user: just increment the like count
    return prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    // User has already liked the post, so unlike it
    const [, post] = await prisma.$transaction([
      prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return post;
  } else {
    // User has not liked the post, so like it
    const [, post] = await prisma.$transaction([
      prisma.like.create({
        data: {
          postId,
          userId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    return post;
  }
};
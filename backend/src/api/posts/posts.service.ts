
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import type { createPostSchema, updatePostSchema } from '../../zod/posts.schema.js';

const prisma = new PrismaClient();

export const createPost = async (postData: z.infer<typeof createPostSchema>) => {
  const { tags, ...restOfPostData } = postData;

  return prisma.$transaction(async (prisma) => {
    const newPost = await prisma.post.create({
      data: restOfPostData,
      include: {
        author: true,
      },
    });

    if (tags && tags.length > 0) {
      const tagOperations = tags.map(tagName => {
        return prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      });

      const createdOrFoundTags = await Promise.all(tagOperations);

      await prisma.post.update({
        where: { id: newPost.id },
        data: {
          tags: {
            connect: createdOrFoundTags.map(tag => ({ id: tag.id })),
          },
        },
      });
    }

    return prisma.post.findUnique({
      where: { id: newPost.id },
      include: {
        author: true,
        tags: true,
      },
    });
  });
};

export const updatePost = async (id: number, postData: z.infer<typeof updatePostSchema>) => {
  return prisma.post.update({
    where: { id },
    data: postData,
  });
};

export const deletePost = async (id: number) => {
  return prisma.$transaction(async (prisma) => {
    // Delete all likes associated with the post
    await prisma.like.deleteMany({
      where: { postId: id },
    });
    // Then delete the post
    return prisma.post.delete({
      where: { id },
    });
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

export const getAllTags = async () => {
  return prisma.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

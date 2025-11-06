
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
  const { tags, ...restOfPostData } = postData;

  return prisma.$transaction(async (prisma) => {
    // Update post data
    const updatedPost = await prisma.post.update({
      where: { id },
      data: restOfPostData,
    });

    // Handle tags
    if (tags !== undefined) {
      if (tags.length > 0) {
        const tagOperations = tags.map(tagName => {
          return prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
        });

        const createdOrFoundTags = await Promise.all(tagOperations);

        console.log('Updating post relations:');
        console.log('Post ID:', id);
        console.log('Tags received:', tags);
        console.log('Created or found tags:', createdOrFoundTags);

        try {
          await prisma.post.update({
            where: { id },
            data: {
              tags: {
                set: createdOrFoundTags.map(tag => ({ id: tag.id })),
              },
            },
          });
          console.log('Post tags relation update successful for Post ID:', id);
        } catch (tagUpdateError) {
          console.error('Error updating post tags relation for Post ID:', id, tagUpdateError);
          throw tagUpdateError; // Re-throw to ensure transaction rollback
        }
      } else { // This is the 'else' for if (tags.length > 0)
        // If no tags are provided, disconnect all existing tags
        await prisma.post.update({
          where: { id },
          data: {
            tags: { set: [] },
          },
        });
      }
    } // This brace closes the if (tags !== undefined) block

    // After successfully updating post tags, clean up orphan tags
    const allTags = await prisma.tag.findMany({
      include: {
        posts: {
          select: { id: true }, // Only need to know if there are any posts
        },
      },
    });

    for (const tag of allTags) {
      if (tag.posts.length === 0) {
        await prisma.tag.delete({
          where: { id: tag.id },
        });
        console.log(`Deleted orphan tag: ${tag.name} (ID: ${tag.id})`);
      }
    }

    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      },
    });
  });
};

export const deletePost = async (id: number) => {
  return prisma.$transaction(async (prisma) => {
    // Get tags associated with the post before deleting the post
    const postToDelete = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!postToDelete) {
      throw new Error('Post not found');
    }

    // Delete all likes associated with the post
    await prisma.like.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    // After deleting the post, check for orphan tags
    for (const tag of postToDelete.tags) {
      const remainingPostsWithTag = await prisma.post.count({
        where: {
          tags: {
            some: {
              id: tag.id,
            },
          },
        },
      });

      if (remainingPostsWithTag === 0) {
        await prisma.tag.delete({
          where: { id: tag.id },
        });
        console.log(`Deleted orphan tag: ${tag.name} (ID: ${tag.id})`);
      }
    }
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

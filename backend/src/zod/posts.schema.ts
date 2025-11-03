
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.any(),
  content: z.any(),
  authorId: z.number(),
  published: z.boolean().optional(),
  summary: z.any().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  published: z.boolean().optional(),
});

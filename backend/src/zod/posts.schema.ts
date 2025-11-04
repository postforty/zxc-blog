
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.any(),
  content: z.any(),
  authorId: z.number(),
  published: z.boolean().optional(),
  summary: z.any().optional(),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  title: z.any().optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  summary: z.any().optional(),
});


import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  authorId: z.number(),
  postId: z.number(),
  parentId: z.number().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
});

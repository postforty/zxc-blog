import { z } from "zod";

const i18nStringSchema = z.object({
  ko: z.string(),
  en: z.string(),
});

export const createPostSchema = z.object({
  title: z.any(),
  content: z.any(),
  authorId: z.number(),
  published: z.boolean().optional(),
  summary: z.any().optional(),
  tags: z.array(i18nStringSchema).optional(),
});

export const updatePostSchema = z.object({
  title: z.any().optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  summary: z.any().optional(),
  tags: z.array(i18nStringSchema).optional(),
});

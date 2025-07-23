import { z } from 'zod';

export const TagSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TagPostSchema = TagSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const TagPutSchema = TagSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Tag = z.infer<typeof TagSchema>;
export type TagPost = z.infer<typeof TagPostSchema>;
export type TagPut = z.infer<typeof TagPutSchema>;

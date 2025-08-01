import { z } from 'zod';

export const TagSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TagDetailsSchema = TagSchema.omit({
  createdAt: true,
  updatedAt: true,
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

export const TagPostRelationSchema = z.object({
  tagId: z.number().int().positive(),
  postId: z.number().int().positive(),
});

export type Tag = z.infer<typeof TagSchema>;
export type TagDetails = z.infer<typeof TagDetailsSchema>;
export type TagPost = z.infer<typeof TagPostSchema>;
export type TagPut = z.infer<typeof TagPutSchema>;
export type TagPostRelation = z.infer<typeof TagPostRelationSchema>;

import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategoryPostSchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CategoryPutSchema = CategorySchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryPost = z.infer<typeof CategoryPostSchema>;
export type CategoryPut = z.infer<typeof CategoryPutSchema>;

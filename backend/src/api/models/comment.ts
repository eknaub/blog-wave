import { z } from 'zod';
import { UserDetailSchema } from './user';
import { PostDetailSchema } from './post';

export const CommentSchema = z.object({
  id: z.number().int().positive(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be at most 1000 characters')
    .regex(
      /^[\s\S]{1,1000}$/,
      'Content must be at least 1 character long and can include any characters'
    )
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: UserDetailSchema,
  post: PostDetailSchema,
});

export const CommentCreateSchema = z.object({
  content: CommentSchema.shape.content,
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
});

export const CommentUpdateSchema = CommentCreateSchema.partial();

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

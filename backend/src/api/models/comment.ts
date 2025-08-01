import { z } from 'zod';
import { UserDetailSchema } from './user';

export const CommentVoteSchema = z.object({
  id: z.number().int().positive(),
  commentId: z.number().int().positive(),
  userId: z.number().int().positive(),
  value: z.enum(['LIKE', 'DISLIKE']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CommentVoteUpdateSchema = z.object({
  value: z.enum(['LIKE', 'DISLIKE']),
});

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
  votesCount: z.number().default(0),
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
export type CommentVote = z.infer<typeof CommentVoteSchema>;
export type CommentVoteUpdate = z.infer<typeof CommentVoteUpdateSchema>;

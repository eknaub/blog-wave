import { z } from 'zod';
import { UserDetailSchema } from './user';
import { CategoryDetailsSchema } from './category';
import { TagDetailsSchema } from './tag';

export const PostVoteSchema = z.object({
  id: z.number().int().positive(),
  postId: z.number().int().positive(),
  userId: z.number().int().positive(),
  value: z.enum(['LIKE', 'DISLIKE']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PostVoteUpdateSchema = z.object({
  value: z.enum(['LIKE', 'DISLIKE']),
});

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .regex(
      /^[\w\s-]{1,255}$/,
      'Title must be alphanumeric and can include spaces and hyphens'
    )
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be at most 5000 characters')
    .regex(
      /^[\s\S]{1,5000}$/,
      'Content must be at least 1 character long and can include any characters'
    )
    .trim(),
  published: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  author: UserDetailSchema,
  categories: z.array(CategoryDetailsSchema).nonempty(),
  tags: z.array(TagDetailsSchema).nonempty(),
  votesCount: z.number().default(0),
});

export const PostDetailSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
});

export const PostCreateSchema = z.object({
  title: PostSchema.shape.title,
  content: PostSchema.shape.content,
  authorId: z.number().int().positive(),
  published: PostSchema.shape.published.optional(),
  categories: z.array(z.number().int().positive()).nonempty(),
  tags: z.array(z.number().int().positive()).nonempty(),
});

export const PostUpdateSchema = z.object({
  title: PostSchema.shape.title.optional(),
  content: PostSchema.shape.content.optional(),
  published: PostSchema.shape.published.optional(),
  authorId: z.number().int().positive().optional(),
  categories: z.array(z.number().int().positive()).nonempty().optional(),
  tags: z.array(z.number().int().positive()).nonempty().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;
export type PostVote = z.infer<typeof PostVoteSchema>;
export type PostVoteUpdate = z.infer<typeof PostVoteUpdateSchema>;

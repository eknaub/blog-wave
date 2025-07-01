import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  username: z.string().min(1, 'Username is required').trim(),
  email: z.string().email('Invalid email format').trim(),
});

export const UserCreateSchema = UserSchema;

export const UserUpdateSchema = UserSchema.omit({ id: true });

export const PostSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  authorId: z.number().int().positive('Author ID must be a positive integer'),
});

export const PostCreateSchema = PostSchema;

export const PostUpdateSchema = PostSchema.omit({ id: true });

export const CommentSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  content: z.string().min(1, 'Content is required').trim(),
  postId: z.number().int().positive('Post ID must be a positive integer'),
  authorId: z.number().int().positive('Author ID must be a positive integer'),
});

export const CommentCreateSchema = CommentSchema;

export const CommentUpdateSchema = CommentSchema.omit({ id: true });

// Type inference from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export type Post = z.infer<typeof PostSchema>;
export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

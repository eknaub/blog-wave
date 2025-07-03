import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1, 'Username is required').max(50).trim(),
  email: z.string().email('Invalid email format').max(255).trim(),
  password: z.string().min(1, 'Password is required').max(255).trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title is required').max(255).trim(),
  content: z.string().min(1, 'Content is required').trim(),
  authorId: z.number().int().positive(),
  published: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CommentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1, 'Content is required').trim(),
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const PostCreateSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CommentCreateSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserUpdateSchema = UserCreateSchema.partial();
export const PostUpdateSchema = PostCreateSchema.partial();
export const CommentUpdateSchema = CommentCreateSchema.partial();

export const UserWithRelationsSchema = UserSchema.extend({
  posts: z.array(PostSchema).optional(),
  comments: z.array(CommentSchema).optional(),
});

export const PostWithRelationsSchema = PostSchema.extend({
  author: UserSchema.optional(),
  comments: z.array(CommentSchema).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserWithRelations = z.infer<typeof UserWithRelationsSchema>;

export type Post = z.infer<typeof PostSchema>;
export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;
export type PostWithRelations = z.infer<typeof PostWithRelationsSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

import { z } from 'zod';

export const AiSchema = z.object({
  contents: z.string(),
});

export const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_]{3,20}$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters')
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    )
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
  authorId: z.number().int().positive(),
  published: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
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

export const PostPublishSchema = z.object({
  published: z.boolean(),
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

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required').trim(),
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

export type Login = z.infer<typeof LoginSchema>;

export type Ai = z.infer<typeof AiSchema>;

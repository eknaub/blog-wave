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
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UserDetailSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string().email(),
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
});

const PostDetailSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
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
  post: PostDetailSchema,
});

export const UserCreateSchema = z.object({
  username: UserSchema.shape.username,
  email: UserSchema.shape.email,
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    )
    .trim(),
});

export const PostCreateSchema = z.object({
  title: PostSchema.shape.title,
  content: PostSchema.shape.content,
  authorId: z.number().int().positive(),
  published: PostSchema.shape.published.optional(),
});

export const PostPublishSchema = z.object({
  published: z.boolean(),
});

export const CommentCreateSchema = z.object({
  content: CommentSchema.shape.content,
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
});

export const UserUpdateSchema = UserCreateSchema.partial();
export const PostUpdateSchema = PostCreateSchema.partial();
export const CommentUpdateSchema = CommentCreateSchema.partial();

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required').trim(),
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserDetail = z.infer<typeof UserDetailSchema>;

export type Post = z.infer<typeof PostSchema>;
export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

export type Login = z.infer<typeof LoginSchema>;

export type Ai = z.infer<typeof AiSchema>;

import zodToJsonSchema from 'zod-to-json-schema';
import {
  AiSchema,
  CommentCreateSchema,
  CommentSchema,
  LoginSchema,
  PostCreateSchema,
  PostSchema,
  UserCreateSchema,
  UserSchema,
} from './interfaces';

export const aiSwaggerSchema = zodToJsonSchema(AiSchema, 'Ai');

export const commentSwaggerSchema = zodToJsonSchema(CommentSchema, 'Comment');
export const commentCreateSwaggerSchema = zodToJsonSchema(
  CommentCreateSchema,
  'CommentCreatePost'
);
export const commentUpdateSwaggerSchema = zodToJsonSchema(
  CommentCreateSchema.partial(),
  'CommentPut'
);

export const userSwaggerSchema = zodToJsonSchema(UserSchema, 'User');
export const userPostSwaggerSchema = zodToJsonSchema(
  UserCreateSchema,
  'UserPost'
);
export const userUpdateSwaggerSchema = zodToJsonSchema(
  UserCreateSchema.partial(),
  'UserPut'
);

export const postSwaggerSchema = zodToJsonSchema(PostSchema, 'Post');
export const postUpdateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema.partial(),
  'PostPut'
);
export const postCreateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema,
  'PostPost'
);

export const loginSwaggerSchema = zodToJsonSchema(LoginSchema, 'Login');

import zodToJsonSchema from 'zod-to-json-schema';
import { CommentCreateSchema, CommentSchema } from './comment';

export const commentSwaggerSchema = zodToJsonSchema(CommentSchema, 'Comment');
export const commentCreateSwaggerSchema = zodToJsonSchema(
  CommentCreateSchema,
  'CommentCreatePost'
);
export const commentUpdateSwaggerSchema = zodToJsonSchema(
  CommentCreateSchema.partial(),
  'CommentPut'
);

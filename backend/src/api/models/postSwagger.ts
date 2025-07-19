import zodToJsonSchema from 'zod-to-json-schema';
import { PostCreateSchema, PostSchema } from './post';

export const postSwaggerSchema = zodToJsonSchema(PostSchema, 'Post');
export const postUpdateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema.partial(),
  'PostPut'
);
export const postCreateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema,
  'PostPost'
);

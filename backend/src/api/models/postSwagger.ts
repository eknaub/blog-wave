import zodToJsonSchema from 'zod-to-json-schema';
import {
  PostCreateSchema,
  PostSchema,
  PostVoteSchema,
  PostVoteUpdateSchema,
} from './post';

export const postSwaggerSchema = zodToJsonSchema(PostSchema, 'Post');
export const postUpdateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema.partial(),
  'PostPut'
);
export const postCreateSwaggerSchema = zodToJsonSchema(
  PostCreateSchema,
  'PostPost'
);
export const postVoteSwaggerSchema = zodToJsonSchema(
  PostVoteSchema,
  'PostVote'
);
export const postVoteBaseSwaggerSchema = zodToJsonSchema(
  PostVoteUpdateSchema,
  'PostVoteUpdate'
);

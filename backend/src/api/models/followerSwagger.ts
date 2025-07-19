import zodToJsonSchema from 'zod-to-json-schema';
import {
  BaseFollowerSchema,
  FollowerCreateSchema,
  FollowerSchema,
} from './follower';

export const followerSwaggerSchema = zodToJsonSchema(
  FollowerSchema,
  'Follower'
);
export const followerCreateSwaggerSchema = zodToJsonSchema(
  FollowerCreateSchema,
  'FollowerCreate'
);

export const followerBaseSwaggerSchema = zodToJsonSchema(
  BaseFollowerSchema,
  'BaseFollower'
);

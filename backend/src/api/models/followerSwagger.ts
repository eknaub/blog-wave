import zodToJsonSchema from 'zod-to-json-schema';
import {
  BaseFollowerSchema,
  FollowerCreateSchema,
  FollowerSchema,
} from './follower';
import { BaseUserSchema } from './user';

export const followerSwaggerSchema = zodToJsonSchema(FollowerSchema, {
  // Use 'none' to avoid generating a $ref, because follwoer and following uses the same schema
  $refStrategy: 'none',
  name: 'Follower',
  definitions: {
    User: BaseUserSchema,
  },
});
export const followerCreateSwaggerSchema = zodToJsonSchema(
  FollowerCreateSchema,
  'FollowerCreate'
);

export const followerBaseSwaggerSchema = zodToJsonSchema(
  BaseFollowerSchema,
  'BaseFollower'
);

import zodToJsonSchema from 'zod-to-json-schema';
import { BaseUserSchema, ExtendedUserSchema, UserCreateSchema } from './user';

export const userSwaggerSchema = zodToJsonSchema(BaseUserSchema, 'User');
export const extendedUserSchema = zodToJsonSchema(
  ExtendedUserSchema,
  'ExtendedUser'
);
export const userPostSwaggerSchema = zodToJsonSchema(
  UserCreateSchema,
  'UserPost'
);
export const userUpdateSwaggerSchema = zodToJsonSchema(
  UserCreateSchema.partial(),
  'UserPut'
);

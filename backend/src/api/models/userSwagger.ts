import zodToJsonSchema from 'zod-to-json-schema';
import { BaseUserSchema, UserCreateSchema } from './user';

export const userSwaggerSchema = zodToJsonSchema(BaseUserSchema, 'User');
export const userPostSwaggerSchema = zodToJsonSchema(
  UserCreateSchema,
  'UserPost'
);
export const userUpdateSwaggerSchema = zodToJsonSchema(
  UserCreateSchema.partial(),
  'UserPut'
);

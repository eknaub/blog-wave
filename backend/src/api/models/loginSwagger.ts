import zodToJsonSchema from 'zod-to-json-schema';
import { LoginSchema } from './login';

export const loginSwaggerSchema = zodToJsonSchema(LoginSchema, 'Login');

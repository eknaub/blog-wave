import zodToJsonSchema from 'zod-to-json-schema';
import { AiSchema } from './ai';

export const aiSwaggerSchema = zodToJsonSchema(AiSchema, 'Ai');

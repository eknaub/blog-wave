import zodToJsonSchema from 'zod-to-json-schema';
import {
  CategoryPostSchema,
  CategorySchema,
  CategoryPutSchema,
  CategoryPostRelationSchema,
} from './category';

export const categorySwaggerSchema = zodToJsonSchema(
  CategorySchema,
  'Category'
);

export const categoryPostSwaggerSchema = zodToJsonSchema(
  CategoryPostSchema,
  'CategoryPost'
);

export const categoryPutSwaggerSchema = zodToJsonSchema(
  CategoryPutSchema,
  'CategoryPut'
);

export const categoryPostRelationSwaggerSchema = zodToJsonSchema(
  CategoryPostRelationSchema,
  'CategoryPostRelation'
);

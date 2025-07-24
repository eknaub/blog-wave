import zodToJsonSchema from 'zod-to-json-schema';
import {
  TagPostRelationSchema,
  TagPostSchema,
  TagPutSchema,
  TagSchema,
} from './tag';

export const tagSwaggerSchema = zodToJsonSchema(TagSchema, 'Tag');

export const tagPostSwaggerSchema = zodToJsonSchema(TagPostSchema, 'TagPost');

export const tagPutSwaggerSchema = zodToJsonSchema(TagPutSchema, 'TagPut');

export const tagPostRelationSwaggerSchema = zodToJsonSchema(
  TagPostRelationSchema,
  'TagPostRelation'
);

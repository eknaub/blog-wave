import zodToJsonSchema from 'zod-to-json-schema';
import {
  TagDetailsSchema,
  TagPostRelationSchema,
  TagPostSchema,
  TagPutSchema,
  TagSchema,
} from './tag';

export const tagSwaggerSchema = zodToJsonSchema(TagSchema, 'Tag');

export const tagDetailsSwaggerSchema = zodToJsonSchema(
  TagDetailsSchema,
  'TagDetails'
);

export const tagPostSwaggerSchema = zodToJsonSchema(TagPostSchema, 'TagPost');

export const tagPutSwaggerSchema = zodToJsonSchema(TagPutSchema, 'TagPut');

export const tagPostRelationSwaggerSchema = zodToJsonSchema(
  TagPostRelationSchema,
  'TagPostRelation'
);

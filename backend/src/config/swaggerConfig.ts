import swaggerJSDoc from 'swagger-jsdoc';
import {
  aiSwaggerSchema,
  commentCreateSwaggerSchema,
  commentSwaggerSchema,
  commentUpdateSwaggerSchema,
  loginSwaggerSchema,
  postCreateSwaggerSchema,
  postSwaggerSchema,
  postUpdateSwaggerSchema,
  userPostSwaggerSchema,
  userSwaggerSchema,
  userUpdateSwaggerSchema,
} from '../api/swaggerDtos';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Odin Blog API',
      version: '1.0.0',
      description: 'API documentation for Odin Blog',
    },
    components: {
      schemas: {
        // AI schemas
        Ai: aiSwaggerSchema.definitions?.Ai,
        //User schemas
        User: userSwaggerSchema.definitions?.User,
        UserPost: userPostSwaggerSchema.definitions?.UserPost,
        UserPut: userUpdateSwaggerSchema.definitions?.UserPut,
        // Post schemas
        Post: postSwaggerSchema.definitions?.Post,
        PostPost: postCreateSwaggerSchema.definitions?.PostPost,
        PostPut: postUpdateSwaggerSchema.definitions?.PostPut,
        // Comment schemas
        Comment: commentSwaggerSchema.definitions?.Comment,
        CommentPost: commentCreateSwaggerSchema.definitions?.CommentCreatePost,
        CommentPut: commentUpdateSwaggerSchema.definitions?.CommentPut,
        // Login schema
        Login: loginSwaggerSchema.definitions?.Login,
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

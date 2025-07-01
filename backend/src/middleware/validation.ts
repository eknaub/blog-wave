import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidatedRequest<TBody = any, TQuery = any, TParams = any>
  extends Request {
  validatedBody?: TBody;
  validatedQuery?: TQuery;
  validatedParams?: TParams;
}

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

export function validateParams(schema: z.ZodTypeAny) {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Parameter validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Query validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

export const IdParamSchema = z.object({
  id: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ID must be a positive number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const UserIdParamSchema = z.object({
  userId: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'User ID must be a positive number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const PostIdParamSchema = z.object({
  postId: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Post ID must be a positive number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const PostAndCommentIdParamSchema = z.object({
  postId: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Post ID must be a positive number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  commentId: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Comment ID must be a positive number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
});

export const OptionalUserIdQuerySchema = z.object({
  userId: z.string().optional(),
});

export type { ValidatedRequest };

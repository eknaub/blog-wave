import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendError } from '../utils/response';

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
        const errorDetails = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        sendError(
          res,
          'Validation failed',
          400,
          errorDetails.map(detail => `${detail.field}: ${detail.message}`)
        );
      } else {
        sendError(res, 'Internal server error', 500, [
          error instanceof Error ? error.message : String(error),
        ]);
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
        const errorDetails = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        sendError(
          res,
          'Parameter validation failed',
          400,
          errorDetails.map(detail => `${detail.field}: ${detail.message}`)
        );
      } else {
        sendError(res, 'Internal server error', 500, [
          error instanceof Error ? error.message : String(error),
        ]);
      }
    }
  };
}

export function validateQuery(schema: z.ZodTypeAny) {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        sendError(
          res,
          'Query validation failed',
          400,
          errorDetails.map(detail => `${detail.field}: ${detail.message}`)
        );
      } else {
        sendError(res, 'Internal server error', 500, [
          error instanceof Error ? error.message : String(error),
        ]);
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

export const UnfollowIdParamSchema = z.object({
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
  unfollowId: z.string().transform((val, ctx) => {
    const parsed = Number(val);
    if (isNaN(parsed) || parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unfollow ID must be a positive number',
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

export const AiContentParamSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(5000)
    .transform((val, ctx) => {
      if (!/^[\s\S]{1,5000}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Content must be between 1 and 5000 characters',
        });
        return z.NEVER;
      }
      return val;
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
  userId: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;

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

export type { ValidatedRequest };

import { z } from 'zod';

export const OptionalUserIdAndPublishedQuerySchema = z.object({
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
  published: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (val === undefined) return undefined;
      if (val === 'true') return true;
      if (val === 'false') return false;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Published must be "true" or "false"',
      });
      return z.NEVER;
    }),
});

export const OptionalVotesQuerySchema = z.object({
  type: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;

      if (val !== 'LIKE' && val !== 'DISLIKE') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Type must be either "LIKE" or "DISLIKE"',
        });
        return z.NEVER;
      }
      return val as 'LIKE' | 'DISLIKE';
    }),
});

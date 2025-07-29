import { z } from 'zod';

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

export const VotesQuerySchema = z.object({
  type: z.string().transform((val, ctx) => {
    if (val !== 'LIKE' && val !== 'DISLIKE') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Like must be either "LIKE" or "DISLIKE"',
      });
      return z.NEVER;
    }
    return val as 'LIKE' | 'DISLIKE';
  }),
});

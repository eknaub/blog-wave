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

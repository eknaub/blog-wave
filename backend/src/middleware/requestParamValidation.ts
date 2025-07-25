import { z } from 'zod';

const positiveNumberParam = (
  paramName: string,
  label?: string
): z.ZodObject<{ [key: string]: z.ZodEffects<z.ZodString, number, string> }> =>
  z.object({
    [paramName]: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label ?? paramName} must be a positive number`,
        });
        return z.NEVER;
      }
      return parsed;
    }),
  });

export const IdParamSchema = positiveNumberParam('id', 'ID');
export const UserIdParamSchema = positiveNumberParam('userId', 'User ID');
export const PostIdParamSchema = positiveNumberParam('postId', 'Post ID');
export const CategoryIdParamSchema = positiveNumberParam(
  'categoryId',
  'Category ID'
);
export const TagIdParamSchema = positiveNumberParam('tagId', 'Tag ID');
export const UnfollowIdParamSchema = z.object({
  ...positiveNumberParam('unfollowId', 'Unfollow ID').shape,
  ...positiveNumberParam('userId', 'User ID').shape,
});
export const PostAndCommentIdParamSchema = z.object({
  ...positiveNumberParam('postId', 'Post ID').shape,
  ...positiveNumberParam('commentId', 'Comment ID').shape,
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

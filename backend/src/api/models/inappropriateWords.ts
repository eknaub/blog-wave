import { z } from 'zod';

export const InappropriateWordsResponseSchema = z.object({
  inappropriate: z.boolean(),
  words: z.array(z.string()),
});

export type InappropriateWordsResponse = z.infer<
  typeof InappropriateWordsResponseSchema
>;

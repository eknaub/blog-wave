import { z } from 'zod';

export const AiSchema = z.object({
  contents: z.string(),
});

export type Ai = z.infer<typeof AiSchema>;

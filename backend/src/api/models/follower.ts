import { z } from 'zod';
import { BaseUserSchema } from './user';

export const BaseFollowerSchema = z.object({
  id: z.number().int().positive(),
  followerId: z.number().int().positive(),
  followingId: z.number().int().positive(),
});

export const FollowerSchema = z.object({
  id: z.number().int().positive(),
  followerId: z.number().int().positive(),
  followingId: z.number().int().positive(),
  following: BaseUserSchema,
});

export const FollowerCreateSchema = z.object({
  followId: z.number().int().positive(),
});

export type BaseFollower = z.infer<typeof BaseFollowerSchema>;
export type Follower = z.infer<typeof FollowerSchema>;
export type FollowerCreate = z.infer<typeof FollowerCreateSchema>;

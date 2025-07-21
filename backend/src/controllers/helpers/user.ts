import { Response } from 'express';
import prisma from '../../prisma/client';
import { sendNotFound } from '../../utils/response';
import { User } from '../../api/models/user';

export async function getUserOrNotFound(
  userId: number | undefined,
  res: Response
): Promise<User | null> {
  if (!userId) {
    sendNotFound(res, 'User ID is required.');
    return null;
  }

  const baseSelect = {
    id: true,
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    followersCount: true,
    followingCount: true,
  };

  const foundUser = await prisma.users.findUnique({
    select: baseSelect,
    where: { id: userId },
  });

  if (!foundUser) {
    sendNotFound(res, 'User not found. Please provide a valid user ID.');
    return null;
  }

  return foundUser;
}

import { Response } from 'express';
import prisma from '../../prisma/client';
import { sendNotFound } from '../../utils/response';
import { ExtendedUser, User } from '../../api/models/user';

export async function getExtendedUser(user: User): Promise<ExtendedUser> {
  const followersCount = await prisma.userFollows.count({
    where: { followingId: user.id },
  });

  const followingCount = await prisma.userFollows.count({
    where: { followerId: user.id },
  });

  return {
    ...user,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    followersCount,
    followingCount,
  };
}

export async function getUserOrNotFound(
  userId: number | undefined,
  res: Response,
  options?: { fetchExtendedUser?: boolean }
): Promise<ExtendedUser | User | null> {
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
  };

  const foundUser = await prisma.users.findUnique({
    select: baseSelect,
    where: { id: userId },
  });

  if (!foundUser) {
    sendNotFound(res, 'User not found. Please provide a valid user ID.');
    return null;
  }

  if (!options?.fetchExtendedUser) {
    return foundUser;
  }

  const extendedUser = await getExtendedUser(foundUser);

  return extendedUser;
}

import { Response } from 'express';
import prisma from '../../prisma/client';
import { sendNotFound } from '../../utils/response';
import { User } from '../../api/models/user';

export function filterUserPassword<T extends { password?: unknown }>(
  user: T
): Omit<T, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
}

export async function fetchUserIfExists(
  userId: number | undefined,
  res: Response
): Promise<User | null> {
  if (!userId) {
    sendNotFound(res, 'User ID is required.');
    return null;
  }

  const foundUser = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!foundUser) {
    sendNotFound(res, 'User not found. Please provide a valid user ID.');
    return null;
  }

  return filterUserPassword(foundUser) as Omit<User, 'password'>;
}

import { Response } from 'express';
import { User, UserUpdate } from '../api/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import {
  sendDeleted,
  sendError,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

class UserController {
  async getUsers(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const data = await prisma.users.findMany();

      const sendData: User[] = data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
      }));
      sendSuccess(res, sendData, 'Users retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve users', 500, [errorMessage]);
    }
  }

  async putUser(
    req: ValidatedRequest<UserUpdate, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const validatedUser: UserUpdate = req.validatedBody!;
      const foundUser = await prisma.users.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
        },
        where: { id: userId },
      });

      if (!foundUser) {
        sendNotFound(res, 'User not found');
        return;
      }

      const updatedUser = await prisma.users.update({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { id: userId },
        data: {
          ...validatedUser,
          updatedAt: new Date(),
          password: validatedUser.password
            ? await bcrypt.hash(validatedUser.password, 12)
            : undefined,
        },
      });

      sendUpdated(res, updatedUser, 'User updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to update user', 500, [errorMessage]);
    }
  }

  async deleteUser(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const foundUser = await prisma.users.findUnique({
        select: {
          id: true,
        },
        where: { id: userId },
      });

      if (!foundUser) {
        sendNotFound(res, 'User not found');
        return;
      }

      const deletedUser = await prisma.users.delete({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { id: userId },
      });

      sendDeleted(res, deletedUser, 'User deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to delete user', 500, [errorMessage]);
    }
  }

  async getUser(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const foundUser = await prisma.users.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { id: userId },
      });

      if (!foundUser) {
        sendNotFound(res, 'User not found');
        return;
      }

      sendSuccess(res, foundUser, 'User retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve user', 500, [errorMessage]);
    }
  }
}

export default UserController;

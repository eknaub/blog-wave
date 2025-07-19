import { Response } from 'express';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import {
  sendDeleted,
  sendError,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { getUserOrNotFound } from './helpers/user';
import { FollowerCreate } from '../api/models/follower';
import { User, UserUpdate } from '../api/models/user';

class UserController {
  async getUsers(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const data = await prisma.users.findMany();

      const sendData: User[] = await Promise.all(
        data.map(async user => {
          const followersCount = await prisma.userFollows.count({
            where: { followingId: user.id },
          });

          const followingCount = await prisma.userFollows.count({
            where: { followerId: user.id },
          });

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt || new Date(),
            updatedAt: user.updatedAt || new Date(),
            followersCount,
            followingCount,
          };
        })
      );

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
      await getUserOrNotFound(userId, res);

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
      await getUserOrNotFound(userId, res);

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
      const foundUser = await getUserOrNotFound(userId, res, {
        fetchExtendedUser: true,
      });

      sendSuccess(res, foundUser, 'User retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve user', 500, [errorMessage]);
    }
  }

  async addFollower(
    req: ValidatedRequest<FollowerCreate, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const validatedFollower: FollowerCreate = req.validatedBody!;
      await getUserOrNotFound(userId, res);

      if (userId === validatedFollower.followId) {
        return sendError(res, 'You cannot follow yourself', 400);
      }

      const newFollow = await prisma.userFollows.create({
        data: {
          followerId: userId,
          followingId: validatedFollower.followId,
        },
      });

      sendSuccess(res, newFollow, 'Follower added successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to add follower', 500, [errorMessage]);
    }
  }

  async removeFollower(
    req: ValidatedRequest<
      FollowerCreate,
      unknown,
      { userId: number; unfollowId: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const unfollowId = req.validatedParams!.unfollowId;
      await getUserOrNotFound(userId, res);

      if (userId === unfollowId) {
        return sendError(res, 'You cannot unfollow yourself', 400);
      }

      const existingFollow = await prisma.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: unfollowId,
          },
        },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          follower: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!existingFollow) {
        return sendError(res, 'Follower not found', 404);
      }

      const updatedUser = await prisma.userFollows.delete({
        where: {
          id: existingFollow.id,
        },
      });

      sendSuccess(res, updatedUser, 'Follower removed successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to remove follower', 500, [errorMessage]);
    }
  }

  async getFollowers(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      await getUserOrNotFound(userId, res);

      const followers = await prisma.userFollows.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      sendSuccess(res, followers, 'Followers retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve followers', 500, [errorMessage]);
    }
  }

  async getFollowing(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      await getUserOrNotFound(userId, res);

      const following = await prisma.userFollows.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      sendSuccess(res, following, 'Following retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve following', 500, [errorMessage]);
    }
  }
}

export default UserController;

import { Response } from 'express';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendError,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { fetchUserIfExists } from './helpers/user';
import { FollowerCreate } from '../api/models/follower';
import { User, UserUpdate } from '../api/models/user';

class UserController {
  async getUsers(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const data = await prisma.users.findMany();

      //Omits sensitive information like password
      const sendData: User[] = await Promise.all(
        data.map(async user => {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
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
      await fetchUserIfExists(userId, res);

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
      await fetchUserIfExists(userId, res);

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
      const foundUser = await fetchUserIfExists(userId, res);

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
      await fetchUserIfExists(userId, res);

      if (userId === validatedFollower.followId) {
        return sendError(res, 'You cannot follow yourself', 400);
      }

      const newFollow = await prisma.userFollows.create({
        data: {
          followerId: userId,
          followingId: validatedFollower.followId,
        },
      });

      await prisma.users.update({
        where: { id: userId },
        data: {
          followingCount: {
            increment: 1,
          },
        },
      });

      await prisma.users.update({
        where: { id: validatedFollower.followId },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      });

      sendCreated(res, newFollow, 'Follower added successfully');
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
      await fetchUserIfExists(userId, res);

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

      await prisma.users.update({
        where: { id: userId },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      });

      await prisma.users.update({
        where: { id: unfollowId },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      });

      sendDeleted(res, updatedUser, 'Follower removed successfully');
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
      await fetchUserIfExists(userId, res);

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
      await fetchUserIfExists(userId, res);

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

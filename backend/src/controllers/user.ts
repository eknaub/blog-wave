import { Response } from 'express';
import { User, UserUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

class UserController {
  async getUsers(req: ValidatedRequest, res: Response): Promise<void> {
    try {
      const data = await prisma.users.findMany();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async postUser(req: ValidatedRequest<User>, res: Response): Promise<void> {
    try {
      const validatedUser: User = req.validatedBody!;
      const foundUser = await prisma.users.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
        },
        where: { email: validatedUser.email },
      });
      const passwordHash = await bcrypt.hash(validatedUser.password, 12);

      if (foundUser) {
        res.status(400).json({ error: 'User with this email already exists.' });
        return;
      }

      const createdUser = await prisma.users.create({
        data: {
          ...validatedUser,
          password: passwordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      res.status(201).json({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.created_at,
        updatedAt: createdUser.updated_at,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async putUser(
    req: ValidatedRequest<UserUpdate, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const validatedUser: UserUpdate = req.validatedBody!;
      const foundUser = await prisma.users.findFirst({
        select: {
          id: true,
          username: true,
          email: true,
        },
        where: { id: userId },
      });

      if (!foundUser) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const updatedUser = await prisma.users.update({
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
        where: { id: userId },
        data: {
          ...validatedUser,
          updated_at: new Date(),
          password: validatedUser.password
            ? await bcrypt.hash(validatedUser.password, 12)
            : undefined,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteUser(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedParams!.userId;
      const foundUser = await prisma.users.findFirst({
        select: {
          id: true,
        },
        where: { id: userId },
      });

      if (!foundUser) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const deletedUser = await prisma.users.delete({
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
        where: { id: userId },
      });

      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default UserController;

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../config/passportConfig';
import prisma from '../prisma/client';
import { ValidatedRequest } from '../middleware/requestValidation';
import { Login } from '../api/models/login';
import {
  sendConflict,
  sendCreated,
  sendError,
  sendSuccess,
} from '../utils/response';
import { UserCreate } from '../api/models/user';
import jwt from 'jsonwebtoken';
import { filterUserPassword } from './helpers/user';

class AuthController {
  async register(
    req: ValidatedRequest<UserCreate>,
    res: Response
  ): Promise<void> {
    try {
      const validatedUser = req.validatedBody!;

      const foundUser = await prisma.users.findFirst({
        where: {
          OR: [
            { username: validatedUser.username },
            { email: validatedUser.email },
          ],
        },
      });

      if (foundUser) {
        sendConflict(
          res,
          'Username or email already exists. Please choose a different one.'
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(validatedUser.password, 12);

      const user = await prisma.users.create({
        data: {
          username: validatedUser.username,
          email: validatedUser.email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '6h' }
      );

      sendCreated(
        res,
        {
          token,
          user: filterUserPassword(user),
        },
        'User registered successfully'
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to register user', details: errorMessage });
    }
  }

  async login(req: ValidatedRequest<Login>, res: Response): Promise<void> {
    try {
      const { username, password } = req.validatedBody!;
      const user = await prisma.users.findFirst({
        where: { username },
      });

      if (!user) {
        sendError(res, 'Authentication failed', 401, ['Invalid credentials']);
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        sendError(res, 'Authentication failed', 401, ['Invalid credentials']);
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '6h' }
      );

      sendSuccess(
        res,
        {
          token,
          user: filterUserPassword(user),
        },
        'Login successful',
        200
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Authentication error', 500, [errorMessage]);
    }
  }

  getProfile(req: Request, res: Response): void {
    if (req.isAuthenticated()) {
      sendSuccess(res, req.user, 'User profile retrieved successfully');
    } else {
      sendError(res, 'Not authenticated', 401, [
        'You must be logged in to access this resource.',
      ]);
    }
  }
}

export default AuthController;

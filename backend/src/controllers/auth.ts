import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passportConfig';
import prisma from '../prisma/client';
import { ValidatedRequest } from '../middleware/validation';
import { UserCreate, Login } from '../utils/interfaces';
import {
  sendConflict,
  sendCreated,
  sendError,
  sendSuccess,
} from '../utils/response';

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
          created_at: new Date(),
          updated_at: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      sendCreated(res, user, 'User registered successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to register user', details: errorMessage });
    }
  }

  login(req: ValidatedRequest<Login>, res: Response, next: NextFunction): void {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        sendError(res, 'Authentication error', 500, [err.message]);
        return;
      }
      if (!user) {
        sendError(res, 'Authentication failed', 401, [
          info.message || 'Invalid credentials',
        ]);
        return;
      }

      req.logIn(user, err => {
        if (err) {
          sendError(res, 'Login failed', 500, [err.message]);
          return;
        }
        sendSuccess(
          res,
          {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          'Login successful',
          200
        );
        return;
      });
    })(req, res, next);
  }

  logout(req: Request, res: Response): void {
    req.logout(err => {
      if (err) {
        sendError(res, 'Logout failed', 500, [err.message]);
        return;
      }
      sendSuccess(res, null, 'Logout successful', 200);
    });
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

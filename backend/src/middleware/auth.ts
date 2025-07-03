import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  sendError(res, 'Authentication required', 401, [
    'You must be logged in to access this resource.',
  ]);
};

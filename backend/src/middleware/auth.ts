import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/passportConfig';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication token is missing or invalid', 401, [
      'You must be logged in to access this resource.',
    ]);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendError(res, 'Invalid token', 401, [
      'Authentication failed',
      errorMessage,
    ]);
    return;
  }
};

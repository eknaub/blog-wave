import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
  errors?: string[]
): void => {
  res.status(statusCode).json({
    success: false,
    error,
    errors,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendUpdated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource updated successfully'
): void => {
  sendSuccess(res, data, message, 200);
};

export const sendDeleted = <T>(
  res: Response,
  data: T,
  message: string = 'Resource deleted successfully'
): void => {
  res.status(200).json({
    success: true,
    data,
    message,
  });
};

export const sendConflict = (
  res: Response,
  message: string = 'Resource already exists'
): void => {
  sendError(res, message, 409);
};

export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
): void => {
  sendError(res, message, 404);
};

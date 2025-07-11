import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../interfaces/response';
import { LoggerService } from '../services/logger.service';
import { LOCAL_STORAGE_CURRENT_USER_KEY } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const logger = inject(LoggerService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.status === 401) {
        //If user is unauthorized, clear local storage and redirect to login
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        router.navigate([RouteNames.LOGIN]);

        errorMessage = 'Session expired. Please log in again.';
        logger.error(`HTTP Error: ${errorMessage}`);
        notificationService.showNotification(errorMessage);

        return throwError(() => new Error(errorMessage));
      }

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network error: ${error.error.message}`;
      } else {
        if (error.error && typeof error.error === 'object') {
          const apiError = error.error as ApiResponse;

          const errorMessages: string[] = [];

          if (apiError.error) {
            errorMessages.push(apiError.error);
          }

          if (apiError.errors && apiError.errors.length > 0) {
            errorMessages.push(...apiError.errors);
          }

          if (apiError.message && !apiError.error && !apiError.errors?.length) {
            errorMessages.push(apiError.message);
          }

          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('; ');
          } else {
            errorMessage = getDefaultErrorMessage(error.status);
          }
        } else {
          errorMessage = getDefaultErrorMessage(error.status);
        }
      }

      logger.error(`HTTP Error: ${errorMessage}`);
      notificationService.showNotification(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return "Access forbidden. You don't have permission.";
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. Server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 0:
      return 'Network connection failed. Please check your internet connection.';
    default:
      return `HTTP Error ${status}: An error occurred`;
  }
}

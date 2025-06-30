import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Network error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage = "Access forbidden. You don't have permission.";
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 502:
            errorMessage = 'Bad gateway. Server is temporarily unavailable.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          case 0:
            errorMessage =
              'Network connection failed. Please check your internet connection.';
            break;
          default:
            errorMessage = `HTTP Error ${error.status}: ${error.statusText}`;
        }
      }

      console.error('HTTP Error Interceptor:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        error: error,
      });

      notificationService.showNotification(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};

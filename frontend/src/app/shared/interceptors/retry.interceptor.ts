import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';
import { retry } from 'rxjs/operators';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const retryDelay = 2000;
  const retryMaxAttempts = 2;

  const skipRetry =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE' ||
    req.headers.has('skip-retry');

  if (skipRetry) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: retryMaxAttempts,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status >= 500 || error.status === 0) {
          const delayMs = retryDelay * Math.pow(2, retryCount - 1);
          console.info(
            `Retrying ${req.url}. Retry count ${retryCount}/${retryMaxAttempts} after ${delayMs}ms`
          );
          return timer(delayMs);
        }
        throw error;
      },
    })
  );
};

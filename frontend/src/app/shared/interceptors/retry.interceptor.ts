import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { timer } from 'rxjs';
import { finalize, retry } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.setLoading(true);

  const retryDelay = 2000;
  const retryMaxAttempts = 2;

  const skipRetry =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE' ||
    req.headers.has('skip-retry');

  if (skipRetry) {
    return next(req).pipe(
      finalize(() => {
        loadingService.setLoading(false);
      })
    );
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
    }),
    finalize(() => {
      loadingService.setLoading(false);
    })
  );
};

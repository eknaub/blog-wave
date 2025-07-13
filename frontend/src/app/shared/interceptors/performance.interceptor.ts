import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

export const performanceInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const startTime = performance.now();

  return next(req).pipe(
    tap({
      next: () => {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        logger.info(`HTTP ${req.method} ${req.url} - ${duration}ms`);
      },
      error: (error) => {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        logger.error(
          `HTTP ${req.method} ${req.url} - ${error.status || 'Error'} - ${duration}ms`
        );
      },
    })
  );
};

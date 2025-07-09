import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { inject } from '@angular/core';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const logger = inject(LoggerService);
  logger.log(`HTTP Request: ${req.method} ${req.url}`);
  return next(req);
}

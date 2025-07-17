import { HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const unwrapApiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (
        event instanceof HttpResponse &&
        event.body &&
        typeof event.body === 'object'
      ) {
        if ('data' in event.body) {
          return event.clone({ body: event.body.data });
        }
      }
      return event;
    })
  );
};

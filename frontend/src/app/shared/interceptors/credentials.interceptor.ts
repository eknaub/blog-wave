import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.apiUrl)) {
    const credentialsReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return next(credentialsReq);
  }

  return next(req);
};

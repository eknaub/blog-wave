import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LOCAL_STORAGE_TOKEN_KEY } from '../services/auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.apiUrl)) {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next(req);
  }

  return next(req);
};

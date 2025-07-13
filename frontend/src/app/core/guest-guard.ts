import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteNames } from '../shared/interfaces/routes';
import { AuthService } from '../shared/services/auth.service';

export const GuestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate([RouteNames.DASHBOARD]);
    return false;
  }

  return true;
};

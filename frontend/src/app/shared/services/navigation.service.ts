import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);

  navigateTo(route: RouteNames) {
    this.router.navigate([route]);
  }

  navigateToWithParams(route: RouteNames, params: any) {
    this.router.navigate([route], { queryParams: params });
  }
}

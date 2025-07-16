import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);

  navigateTo(route: RouteNames): void {
    this.router.navigate([route]);
  }

  navigateToWithParams(
    route: RouteNames,
    params: Record<string, unknown>
  ): void {
    this.router.navigate([route], { queryParams: params });
  }

  navigateToWithState(route: RouteNames, state: Record<string, unknown>): void {
    this.router.navigate([route], { state });
  }

  goBack(): void {
    window.history.back();
  }

  reload(): void {
    window.location.reload();
  }
}

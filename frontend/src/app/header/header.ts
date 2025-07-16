import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouteNames } from '../shared/interfaces/routes';
import { AuthService } from '../shared/services/auth.service';
import { NavigationService } from '../shared/services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);

  protected readonly RouteNames = RouteNames;
  protected readonly isLoggedIn = computed(() =>
    this.authService.isAuthenticated()
  );

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logout successful, navigation handled by service
      },
    });
  }

  protected navigateTo(route: RouteNames): void {
    this.navigationService.navigateTo(route);
  }
}

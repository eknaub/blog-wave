import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../shared/interfaces/routes';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
})
export class Home {
  private readonly authService = inject(AuthService);

  protected readonly RouteNames = RouteNames;
  protected readonly currentUserName = computed(() => {
    const user = this.authService.getCurrentUser();
    return user ? user.username : '';
  });

  protected readonly isLoggedIn = computed(() =>
    this.authService.isAuthenticated()
  );

  protected handleLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Login successful, navigation handled by service
      },
    });
  }
}

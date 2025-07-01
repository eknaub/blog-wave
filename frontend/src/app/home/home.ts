import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../shared/interfaces/routes';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
})
export class Home {
  readonly RouteNames = RouteNames;
  protected authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isAuthenticated());

  handleLogout() {
    this.authService.logout();
  }
}

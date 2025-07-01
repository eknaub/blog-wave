import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../shared/interfaces/routes';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
})
export class Home {
  readonly RouteNames = RouteNames;

  isLoggedIn = signal(false);

  handleLogout() {
    this.isLoggedIn.set(false);
  }
}

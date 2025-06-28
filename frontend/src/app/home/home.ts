import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <main>
      <h1>Welcome to the Home Page</h1>
      @if (!isLoggedIn()) {
      <p>Please log in to access more features.</p>
      <a [routerLink]="['/login']">Login</a>
      <a [routerLink]="['/register']">Register</a>
      } @else {
      <p>Welcome back</p>
      <button (click)="handleLogout()">Log Out</button>
      }
    </main>
  `,
  imports: [RouterLink],
})
export class Home {
  isLoggedIn = signal(false);

  handleLogout() {
    this.isLoggedIn.set(false);
  }
}

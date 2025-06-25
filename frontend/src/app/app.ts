import { Component } from '@angular/core';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  template: `@if (isLoggedIn) {
    <section>
      <h1>Total Users: {{ users.length }}</h1>
      @for (user of users; track user.userName) {
      <app-user
        [age]="user.age"
        [email]="user.email"
        [userName]="user.userName"
      />
      }
    </section>
    <button (click)="handleLogout()">Logout</button>
    } @else {
    <h1>Please log in to view users</h1>
    <button (click)="handleLogin()">Login</button>
    }`,
  imports: [User],
})
export class App {
  isLoggedIn: boolean = true;

  users = [
    { userName: 'JohnDoe', email: 'john@example.com', age: 25 },
    { userName: 'SarahMiller', email: 'sarah.miller@example.com', age: 32 },
    { userName: 'MikeJohnson', email: 'mike.j@example.com', age: 28 },
    { userName: 'EmilyDavis', email: 'emily.davis@example.com', age: 24 },
    { userName: 'ChrisWilson', email: 'chris.wilson@example.com', age: 35 },
  ];

  handleLogin() {
    this.isLoggedIn = true;
  }

  handleLogout() {
    this.isLoggedIn = false;
  }
}

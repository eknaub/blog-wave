import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';
import { UserCard } from './components/user-card/user-card';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.css',
  imports: [DashboardContentWrapper, UserCard],
})
export class Users {
  userService = inject(UserService);
  users = this.userService.users;
  usersLoading = this.userService.usersLoading;
  usersError = this.userService.usersError;
}

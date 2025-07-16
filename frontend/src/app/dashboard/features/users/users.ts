import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { DashboardContentWrapper } from '../../dashboard-content-wrapper/dashboard-content-wrapper';
import { UserCard } from './components/user-card/user-card';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardContentWrapper, UserCard],
})
export class Users {
  private readonly userService = inject(UserService);

  protected readonly users = this.userService.users;
  protected readonly usersLoading = this.userService.usersLoading;
  protected readonly usersError = this.userService.usersError;
}

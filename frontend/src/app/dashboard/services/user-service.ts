import { inject, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, UserPut } from '../../shared/api/models';
import { UsersService as GeneratedUserService } from '../../shared/api/services/users.service';
import { LoggerService } from '../../shared/services/logger.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly generatedUserService = inject(GeneratedUserService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);

  readonly users = signal<User[]>([]);
  readonly usersLoading = signal(false);
  readonly usersError = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): Subscription {
    this.usersLoading.set(true);
    this.usersError.set(null);

    return this.generatedUserService.apiUsersGet().subscribe({
      next: (users) => {
        this.users.set(users);
        this.usersLoading.set(false);
      },
      error: (error) => {
        this.usersError.set(error.message);
        this.usersLoading.set(false);
      },
    });
  }

  refetchUsers(): void {
    this.loadUsers();
  }

  getUserById(userId: number): User | undefined {
    return this.users().find((user) => user.id === userId);
  }

  updateUser(userId: number, userData: Partial<UserPut>): void {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const updatedUser: User = {
      ...user,
      ...userData,
    };

    this.generatedUserService
      .apiUsersUserIdPut({ userId, body: updatedUser })
      .subscribe({
        next: (response) => {
          const index = this.users().findIndex((u) => u.id === userId);
          if (index !== -1) {
            const updatedUsers = [...this.users()];
            updatedUsers[index] = response;
            this.users.set(updatedUsers);
            this.notificationService.showNotification(
              'User updated successfully'
            );
            this.refetchUsers();
          }
        },
        error: (error) => {
          this.logger.error(`Failed to update user: ${error.message}`);
        },
      });
  }
}

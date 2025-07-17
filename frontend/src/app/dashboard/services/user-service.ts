import { inject, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../shared/api/models';
import { UsersService as GeneratedUserService } from '../../shared/api/services/users.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly generatedUserService = inject(GeneratedUserService);
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
}

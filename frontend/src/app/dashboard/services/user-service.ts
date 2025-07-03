import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { BaseHttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseHttp = inject(BaseHttpService);
  users = signal<User[]>([]);
  usersLoading = signal<boolean>(false);
  usersError = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    this.usersLoading.set(true);
    return this.baseHttp.get<User[]>(`/users`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.usersLoading.set(false);
      },
      error: (error) => {
        this.usersError.set(error.message || 'Failed to load users');
        this.usersLoading.set(false);
      },
    });
  }
}

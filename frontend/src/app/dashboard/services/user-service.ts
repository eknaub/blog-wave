import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { BaseHttpService } from '../../shared/services/http.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseHttp = inject(BaseHttpService);

  readonly users = signal<User[]>([]);
  readonly usersLoading = signal(false);
  readonly usersError = signal<string | null>(null);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): Subscription {
    this.usersLoading.set(true);
    this.usersError.set(null);

    return this.baseHttp.get<User[]>('/users').subscribe({
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

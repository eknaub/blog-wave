import { Injectable, resource } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = resource({
    loader: async () => {
      const response = await fetch(`${environment.apiUrl}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json() as Promise<User[]>;
    },
  });
}

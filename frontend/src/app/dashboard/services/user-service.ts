import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [
    { id: 1, username: 'alice', email: 'alice@example.com' },
    { id: 2, username: 'bob', email: 'bob@example.com' },
    { id: 3, username: 'charlie', email: 'charlie@example.com' },
    { id: 4, username: 'diana', email: 'diana@example.com' },
    { id: 5, username: 'eve', email: 'eve@example.com' },
    { id: 6, username: 'frank', email: 'frank@example.com' },
    { id: 7, username: 'grace', email: 'grace@example.com' },
    { id: 8, username: 'henry', email: 'henry@example.com' },
  ];

  getUsers() {
    return this.users;
  }

  constructor() {}
}

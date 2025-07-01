import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private currentUserSignal = signal<User | null>(null);
  public currentUser$ = this.currentUserSignal.asReadonly();

  constructor() {
    this.checkExistingAuth();
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      console.log('Attempting login with', credentials);

      if (credentials.username && credentials.password) {
        const user: User = {
          id: '1',
          username: credentials.username,
          email: `${credentials.username}@example.com`,
        };

        this.setCurrentUser(user);
        this.router.navigate([RouteNames.DASHBOARD]);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate([RouteNames.LOGIN]);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private checkExistingAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  register(credentials: LoginCredentials): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('Registering user with', credentials);
      if (credentials.username && credentials.password) {
        const user: User = {
          id: '2',
          username: credentials.username,
          email: `${credentials.username}@example.com`,
        };
        this.setCurrentUser(user);
        this.router.navigate([RouteNames.DASHBOARD]);
        resolve(true);
      }
    });
  }
}

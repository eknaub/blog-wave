import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';
import { User } from '../interfaces/user';
import { BaseHttpService } from './http.service';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private currentUserSignal = signal<User | null>(null);
  public currentUser$ = this.currentUserSignal.asReadonly();
  private baseHttp = inject(BaseHttpService);

  constructor() {
    this.checkExistingAuth();
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      if (credentials.username && credentials.password) {
        const response = await this.baseHttp
          .post<User>('/auth/login', credentials)
          .toPromise();

        if (response) {
          this.setCurrentUser(response);
          this.router.navigate([RouteNames.DASHBOARD]);
          return true;
        }

        return false;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.baseHttp.post('/auth/logout', {}).toPromise();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.currentUserSignal.set(null);
      localStorage.removeItem('currentUser');
      this.router.navigate([RouteNames.LOGIN]);
    }
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

  async register(credentials: LoginCredentials): Promise<boolean> {
    try {
      console.log('Registering user with', credentials);

      const response = await this.baseHttp
        .post<User>('/auth/register', credentials)
        .toPromise();
      if (response) {
        this.setCurrentUser(response);
        this.router.navigate([RouteNames.DASHBOARD]);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }
}

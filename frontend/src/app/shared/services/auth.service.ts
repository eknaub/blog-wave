import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';
import { User } from '../interfaces/user';
import { BaseHttpService } from './http.service';
import { LoggerService } from './logger.service';

export const LOCAL_STORAGE_CURRENT_USER_KEY = 'currentUser';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private currentUserSignal = signal<User | null>(null);
  public currentUser$ = this.currentUserSignal.asReadonly();
  private baseHttp = inject(BaseHttpService);
  logger = inject(LoggerService);

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
      this.logger.error(`Login failed: ${error}`);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.baseHttp.post('/auth/logout', {}).toPromise();
      this.currentUserSignal.set(null);
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      this.router.navigate([RouteNames.LOGIN]);
    } catch (error) {
      this.logger.error(`Logout failed: ${error}`);
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
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  }

  private checkExistingAuth(): void {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (error) {
        this.logger.error(`Error parsing stored user: ${error}`);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      }
    }
  }

  async register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      if (credentials.username && credentials.password && credentials.email) {
        const response = await this.baseHttp
          .post<User>('/auth/register', credentials)
          .toPromise();
        if (response) {
          this.setCurrentUser(response);
          this.router.navigate([RouteNames.DASHBOARD]);
          return true;
        }
      }
      return false;
    } catch (error) {
      this.logger.error(`Registration failed: ${error}`);
      return false;
    }
  }
}

import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { RouteNames } from '../interfaces/routes';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';
import { User } from '../api/models';
import { AuthService as GeneratedAuthService } from '../api/services/auth.service';

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
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly generatedAuthService = inject(GeneratedAuthService);

  private readonly currentUserSignal = signal<User | null>(null);

  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly getLoggedInUser = computed(() => this.currentUserSignal());

  constructor() {
    this.checkExistingAuth();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    if (!credentials.username || !credentials.password) {
      this.notificationService.showNotification(
        $localize`:@@auth-service.credentials-required:Username and password are required`
      );
      return of(false);
    }

    return this.generatedAuthService
      .apiAuthLoginPost({
        body: {
          username: credentials.username,
          password: credentials.password,
        },
      })
      .pipe(
        map((response) => {
          if (response) {
            this.setCurrentUser(response);
            this.router.navigate([RouteNames.DASHBOARD]);
            this.notificationService.showNotification(
              $localize`:@@auth-service.login-success:Login successful`
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          this.logger.error(`Login failed: ${error}`);
          return of(false);
        })
      );
  }

  logout(): Observable<void> {
    return this.generatedAuthService.apiAuthLogoutPost().pipe(
      map(() => {
        this.currentUserSignal.set(null);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        this.router.navigate([RouteNames.LOGIN]);
        this.notificationService.showNotification(
          $localize`:@@auth-service.logout-success:Logout successful`
        );
      }),
      catchError((error) => {
        this.logger.error(`Logout failed: ${error}`);
        // Still clear local state even if server logout fails
        this.currentUserSignal.set(null);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
        this.router.navigate([RouteNames.LOGIN]);
        return of(void 0);
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<boolean> {
    if (!credentials.username || !credentials.password || !credentials.email) {
      this.notificationService.showNotification(
        $localize`:@@auth-service.credentials-required:All fields are required`
      );
      return of(false);
    }

    return this.generatedAuthService
      .apiAuthRegisterPost({
        body: {
          username: credentials.username,
          password: credentials.password,
          email: credentials.email,
        },
      })
      .pipe(
        map((response) => {
          console.log('Registration response:', response);

          if (response) {
            this.setCurrentUser(response);
            this.router.navigate([RouteNames.DASHBOARD]);
            this.notificationService.showNotification(
              $localize`:@@auth-service.registration-success:Registration successful`
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          this.logger.error(`Registration failed: ${error}`);
          return of(false);
        })
      );
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
        this.logger.error(`Invalid user data in local storage: ${error}`);
        localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      }
    }
  }
}

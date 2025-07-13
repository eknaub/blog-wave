import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from './auth.service';
import { BaseHttpService } from './http.service';
import { LoggerService } from './logger.service';
import { RouteNames } from '../interfaces/routes';
import { User } from '../interfaces/user';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBaseHttp: jasmine.SpyObj<BaseHttpService>;
  let mockLogger: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBaseHttp = jasmine.createSpyObj('BaseHttpService', ['post']);
    mockLogger = jasmine.createSpyObj('LoggerService', ['error']);

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
        { provide: BaseHttpService, useValue: mockBaseHttp },
        { provide: LoggerService, useValue: mockLogger },
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const validCredentials: LoginCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should return true and navigate to dashboard on successful login', async () => {
      mockBaseHttp.post.and.returnValue(of(mockUser));

      const result = await service.login(validCredentials);

      expect(result).toBe(true);
      expect(mockBaseHttp.post).toHaveBeenCalledWith(
        '/auth/login',
        validCredentials
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([RouteNames.DASHBOARD]);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return false when credentials are empty', async () => {
      const emptyCredentials: LoginCredentials = { username: '', password: '' };

      const result = await service.login(emptyCredentials);

      expect(result).toBe(false);
      expect(mockBaseHttp.post).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should return false when username is missing', async () => {
      const invalidCredentials: LoginCredentials = {
        username: '',
        password: 'password123',
      };

      const result = await service.login(invalidCredentials);

      expect(result).toBe(false);
      expect(mockBaseHttp.post).not.toHaveBeenCalled();
    });

    it('should return false when password is missing', async () => {
      const invalidCredentials: LoginCredentials = {
        username: 'testuser',
        password: '',
      };

      const result = await service.login(invalidCredentials);

      expect(result).toBe(false);
      expect(mockBaseHttp.post).not.toHaveBeenCalled();
    });

    it('should return false when server response is null', async () => {
      mockBaseHttp.post.and.returnValue(of(null));

      const result = await service.login(validCredentials);

      expect(result).toBe(false);
      expect(mockBaseHttp.post).toHaveBeenCalledWith(
        '/auth/login',
        validCredentials
      );
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should return false and log error when login fails', async () => {
      const error = new Error('Network error');
      mockBaseHttp.post.and.returnValue(throwError(() => error));

      const result = await service.login(validCredentials);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(`Login failed: ${error}`);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear current user and navigate to login on successful logout', async () => {
      mockBaseHttp.post.and.returnValue(of({}));

      await service.logout();

      expect(mockBaseHttp.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(service.getCurrentUser()).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith([RouteNames.LOGIN]);
    });

    it('should log error if logout fails', async () => {
      const error = new Error('Logout failed');
      mockBaseHttp.post.and.returnValue(throwError(() => error));

      await service.logout();

      expect(mockLogger.error).toHaveBeenCalledWith(`Logout failed: ${error}`);
    });
  });

  describe('userSignal', () => {
    beforeEach(() => {
      service['currentUserSignal'].set(null);
      localStorage.clear();
    });

    it('should return isAuthenticated true if current user is set', () => {
      service['currentUserSignal'].set({ id: 1, username: 'testuser' } as User);
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return isAuthenticated false if current user is not set', () => {
      service['currentUserSignal'].set(null);
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return the current user', () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service['currentUserSignal'].set(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null if no user is set', () => {
      service['currentUserSignal'].set(null);
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should handle error when parsing stored user', () => {
      spyOn(localStorage, 'getItem').and.returnValue('invalid-json');

      service['checkExistingAuth']();

      expect(mockLogger.error).toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('register', () => {
    const mockUser: User = {
      id: 1,
      username: 'newuser',
      email: 'user@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const validCredentials = {
      username: 'newuser',
      password: 'password123',
      email: 'user@example.com',
    };

    beforeEach(() => {
      service['currentUserSignal'].set(null);
      localStorage.clear();
    });

    it('should return true, navigate and set current user on successful registration', async () => {
      mockBaseHttp.post.and.returnValue(of(mockUser));

      const result = await service.register(validCredentials);

      expect(result).toBe(true);
      expect(mockBaseHttp.post).toHaveBeenCalledWith(
        '/auth/register',
        validCredentials
      );
      expect(service.getCurrentUser()).toEqual(mockUser);
      expect(mockRouter.navigate).toHaveBeenCalledWith([RouteNames.DASHBOARD]);
    });

    it('should return false when registration fails', async () => {
      const error = new Error('Registration failed');
      mockBaseHttp.post.and.returnValue(throwError(() => error));

      const result = await service.register(validCredentials);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Registration failed: ${error}`
      );
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return false when credentials are invalid', async () => {
      const invalidCredentials = {
        username: '',
        password: '',
        email: '',
      };

      const result = await service.register(invalidCredentials);

      expect(result).toBe(false);
      expect(mockBaseHttp.post).not.toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { UserService } from './user-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../shared/interfaces/user';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users', () => {
    const mockData: User[] = [
      {
        id: 1,
        username: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    spyOn(service['baseHttp'], 'get').and.returnValue(of(mockData));

    service['loadUsers']();

    expect(service.users().length).toBe(1);
    expect(service.usersError()).toBe(null);
  });

  it('should handle errors when loading users', () => {
    const errorMessage = 'Failed to load users';
    spyOn(service['baseHttp'], 'get').and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    service['loadUsers']();

    expect(service.users().length).toBe(0);
    expect(service.usersError()).toBe(errorMessage);
  });
});

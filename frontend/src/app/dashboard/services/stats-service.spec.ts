import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be state loading if posts are loading', () => {
    spyOn(service['blogService'], 'postsLoading').and.returnValue(true);
    spyOn(service['userService'], 'usersLoading').and.returnValue(false);
    expect(service.isLoading()).toBeTrue();
  });

  it('should be state loading if users are loading', () => {
    spyOn(service['blogService'], 'postsLoading').and.returnValue(false);
    spyOn(service['userService'], 'usersLoading').and.returnValue(true);
    expect(service.isLoading()).toBeTrue();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { RouteNames } from '../interfaces/routes';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to the specified route', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const route = RouteNames.BLOG;
    service.navigateTo(route);

    expect(router.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to the specified route with parameters', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const route = RouteNames.BLOG;
    const params = { page: 1 };
    service.navigateToWithParams(route, params);

    expect(router.navigate).toHaveBeenCalledWith([route], {
      queryParams: params,
    });
  });
});

import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { RouteNames } from '../shared/interfaces/routes';
import { provideZonelessChangeDetection } from '@angular/core';
import { GuestGuard } from './guest-guard';

describe('GuestGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => GuestGuard(...guardParameters));

  beforeEach(() => {
    const authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected-route' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access if not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeTrue();
  });

  it('should redirect to dashboard if authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = executeGuard(mockRoute, mockState);

    expect(router.navigate).toHaveBeenCalledWith([RouteNames.DASHBOARD]);
    expect(result).toBeFalse();
  });
});

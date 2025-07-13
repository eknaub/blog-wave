import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { AuthService } from '../shared/services/auth.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  };

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should check if user is not logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    createComponent();
    expect(component.isLoggedIn()).toBeFalse();
  });

  it('should call logout on authService when handleLogout is called', () => {
    spyOn(authService, 'logout');
    createComponent();
    component.handleLogout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should display logout button when user is logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    createComponent();

    const logoutButton = fixture.nativeElement.querySelector(
      'button[name="logout"]'
    );
    const loginButton = fixture.nativeElement.querySelector(
      'button[name="login"]'
    );
    const registerButton = fixture.nativeElement.querySelector(
      'button[name="register"]'
    );

    expect(logoutButton).toBeTruthy();
    expect(loginButton).toBeFalsy();
    expect(registerButton).toBeFalsy();
  });

  it('should display login and register buttons when user is not logged in', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    createComponent();

    const logoutButton = fixture.nativeElement.querySelector(
      'button[name="logout"]'
    );
    const loginButton = fixture.nativeElement.querySelector(
      'button[name="login"]'
    );
    const registerButton = fixture.nativeElement.querySelector(
      'button[name="register"]'
    );

    expect(logoutButton).toBeFalsy();
    expect(loginButton).toBeTruthy();
    expect(registerButton).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate username field correctly', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('');
    expect(usernameControl?.invalid).toBeTrue();

    usernameControl?.setValue('validuser');
    expect(usernameControl?.valid).toBeTrue();
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.invalid).toBeTrue();

    passwordControl?.setValue('ValidPass123');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeTrue();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as touched when handleLogin is called', () => {
    spyOn(component.loginForm, 'markAllAsTouched');
    component.handleLogin();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should not call authService.login when form is invalid', () => {
    spyOn(component['authService'], 'login');
    component.handleLogin();
    expect(component['authService'].login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid', () => {
    spyOn(component['authService'], 'login');
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'Password123',
    });
    component.handleLogin();
    expect(component['authService'].login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'Password123',
    });
  });

  it('should log error when form is invalid', () => {
    spyOn(component['authService'], 'login');
    component.loginForm.patchValue({
      username: 'user',
      password: 'user',
    });
    spyOn(component.logger, 'error');
    component.handleLogin();
    expect(component.logger.error).toHaveBeenCalledWith('Form is invalid');
  });

  it('should log error when username and password is empty', () => {
    spyOn(component.logger, 'error');
    component.handleLogin();
    expect(component.logger.error).toHaveBeenCalledWith(
      'Username and password are required'
    );
  });

  it('should log error when username or password is empty', () => {
    spyOn(component.logger, 'error');
    component.loginForm.patchValue({ username: '', password: 'Password123' });
    component.handleLogin();
    expect(component.logger.error).toHaveBeenCalledWith(
      'Username and password are required'
    );

    component.loginForm.patchValue({ username: 'testuser', password: '' });
    component.handleLogin();
    expect(component.logger.error).toHaveBeenCalledWith(
      'Username and password are required'
    );
  });

  it('should render input fields with correct attributes', () => {
    const usernameInput = fixture.nativeElement.querySelector(
      'input[formControlName="username"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formControlName="password"]'
    );

    expect(usernameInput).toBeTruthy();
    expect(usernameInput.getAttribute('type')).toBe('text');

    expect(passwordInput).toBeTruthy();
    expect(passwordInput.getAttribute('type')).toBe('password');
  });

  it('should render login button', () => {
    const loginButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(loginButton).toBeTruthy();
  });

  it('should call handleLogin on form submit', () => {
    spyOn(component, 'handleLogin');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.handleLogin).toHaveBeenCalled();
  });

  it('should call togglePasswordVisibility on button click', () => {
    spyOn(component, 'togglePasswordVisibility');
    const toggleButton = fixture.nativeElement.querySelector(
      'button[name="togglePassword"]'
    );
    toggleButton.click();
    expect(component.togglePasswordVisibility).toHaveBeenCalled();
  });
});

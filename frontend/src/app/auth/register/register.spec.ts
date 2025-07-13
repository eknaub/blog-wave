import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { click } from '../../shared/testing';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate username field correctly', () => {
    const usernameControl = component.registerForm.get('username');

    usernameControl?.setValue('');
    expect(usernameControl?.invalid).toBeTrue();

    usernameControl?.setValue('validuser');
    expect(usernameControl?.valid).toBeTrue();
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.registerForm.get('password');
    const confirmPasswordControl =
      component.registerForm.get('confirmPassword');

    passwordControl?.setValue('');
    expect(passwordControl?.invalid).toBeTrue();

    confirmPasswordControl?.setValue('');
    expect(confirmPasswordControl?.invalid).toBeTrue();

    passwordControl?.setValue('ValidPass123');
    expect(passwordControl?.valid).toBeTrue();

    confirmPasswordControl?.setValue('ValidPass123');
    expect(confirmPasswordControl?.valid).toBeTrue();

    confirmPasswordControl?.setValue('ValidPass321');
    expect(confirmPasswordControl?.invalid).toBeTrue();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeTrue();

    expect(component.hideConfirmPassword).toBeTrue();
    component.toggleConfirmPasswordVisibility();
    expect(component.hideConfirmPassword).toBeFalse();
    component.toggleConfirmPasswordVisibility();
    expect(component.hideConfirmPassword).toBeTrue();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
  });

  it('should mark form as touched when handleRegister is called', () => {
    spyOn(component.registerForm, 'markAllAsTouched');
    component.handleRegister();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should not call authService.register when form is invalid', () => {
    spyOn(component['authService'], 'register');
    component.handleRegister();
    expect(component['authService'].register).not.toHaveBeenCalled();
  });

  it('should call authService.register when form is valid', () => {
    spyOn(component['authService'], 'register');
    component.registerForm.patchValue({
      username: 'testuser',
      password: 'Password123',
      confirmPassword: 'Password123',
      email: 'user@example.com',
    });
    component.handleRegister();
    expect(component['authService'].register).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'Password123',
      email: 'user@example.com',
    });
  });

  it('should log error when form is invalid', () => {
    spyOn(component['authService'], 'register');
    component.registerForm.patchValue({
      username: 'user',
      password: 'user',
      confirmPassword: 'user',
      email: 'invalid-email',
    });
    spyOn(component.logger, 'error');
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith('Form is invalid');
  });

  it('should log error when any input is empty', () => {
    spyOn(component.logger, 'error');
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith(
      'All fields are required'
    );

    component.registerForm.patchValue({
      username: '',
      password: 'Password123',
      confirmPassword: 'Password123',
      email: 'user@example.com',
    });
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith(
      'All fields are required'
    );

    component.registerForm.patchValue({
      username: 'user',
      password: '',
      confirmPassword: 'Password123',
      email: 'user@example.com',
    });
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith(
      'All fields are required'
    );

    component.registerForm.patchValue({
      username: 'user',
      password: 'Password123',
      confirmPassword: '',
      email: 'user@example.com',
    });
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith(
      'All fields are required'
    );

    component.registerForm.patchValue({
      username: 'user',
      password: 'Password123',
      confirmPassword: 'Password123',
      email: '',
    });
    component.handleRegister();
    expect(component.logger.error).toHaveBeenCalledWith(
      'All fields are required'
    );
  });

  it('should render input fields with correct attributes', () => {
    const usernameInput = fixture.nativeElement.querySelector(
      'input[formControlName="username"]'
    );
    const passwordInput = fixture.nativeElement.querySelector(
      'input[formControlName="password"]'
    );
    const confirmPasswordInput = fixture.nativeElement.querySelector(
      'input[formControlName="confirmPassword"]'
    );
    const emailInput = fixture.nativeElement.querySelector(
      'input[formControlName="email"]'
    );

    expect(usernameInput).toBeTruthy();
    expect(usernameInput.getAttribute('type')).toBe('text');

    expect(passwordInput).toBeTruthy();
    expect(passwordInput.getAttribute('type')).toBe('password');

    expect(confirmPasswordInput).toBeTruthy();
    expect(confirmPasswordInput.getAttribute('type')).toBe('password');

    expect(emailInput).toBeTruthy();
    expect(emailInput.getAttribute('type')).toBe('email');
  });

  it('should render register button', () => {
    const registerButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(registerButton).toBeTruthy();
  });

  it('should call handleRegister on form submit', () => {
    spyOn(component, 'handleRegister');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.handleRegister).toHaveBeenCalled();
  });

  it('should call togglePasswordVisibility on button click', () => {
    spyOn(component, 'togglePasswordVisibility');
    spyOn(component, 'toggleConfirmPasswordVisibility');

    const togglePasswordButton = fixture.nativeElement.querySelector(
      'button[name="togglePassword"]'
    );
    const toggleConfirmPasswordButton = fixture.nativeElement.querySelector(
      'button[name="confirmPasswordToggle"]'
    );

    click(togglePasswordButton);
    click(toggleConfirmPasswordButton);

    expect(component.toggleConfirmPasswordVisibility).toHaveBeenCalled();
    expect(component.togglePasswordVisibility).toHaveBeenCalled();
  });
});

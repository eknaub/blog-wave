import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';
import { AuthService } from '../../shared/services/auth.service';
import { LoggerService } from '../../shared/services/logger.service';
import { CommonModule } from '@angular/common';
import { AuthInputValidators } from '../../shared/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatError,
    CommonModule,
    MatIconModule,
  ],
})
export class Register {
  readonly RouteNames = RouteNames;
  private authService = inject(AuthService);
  logger = inject(LoggerService);
  hidePassword = true;
  hideConfirmPassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  registerForm = new FormGroup(
    {
      username: new FormControl('', [...AuthInputValidators.username]),
      email: new FormControl('', [...AuthInputValidators.email]),
      password: new FormControl('', [...AuthInputValidators.password]),
      confirmPassword: new FormControl('', [...AuthInputValidators.password]),
    },
    {
      validators: this.matchValidator('password', 'confirmPassword'),
    }
  );

  matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['mismatch']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { mismatch: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    };
  }

  handleRegister() {
    this.registerForm.markAllAsTouched();

    const { username, email, password, confirmPassword } =
      this.registerForm.value;

    if (!username || !email || !password || !confirmPassword) {
      this.logger.error('All fields are required');
      return;
    }

    if (this.registerForm.invalid) {
      this.logger.error('Form is invalid');
      return;
    }

    this.authService.register({
      username,
      password,
      email,
    });
  }
}

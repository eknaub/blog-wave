import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
import { FormValidators } from '../../shared/utils/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
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
  ],
})
export class Login {
  private authService = inject(AuthService);
  logger = inject(LoggerService);
  readonly RouteNames = RouteNames;

  loginForm = new FormGroup({
    username: new FormControl('', [...FormValidators.username]),
    password: new FormControl('', [...FormValidators.password]),
  });

  handleLogin() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.logger.error('Form is invalid');
      return;
    }

    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      this.logger.error('Username and password are required');
      return;
    }

    this.authService.login({
      username: username,
      password: password,
    });
  }
}

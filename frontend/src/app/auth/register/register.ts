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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';
import { AuthService } from '../../shared/services/auth.service';
import { LoggerService } from '../../shared/services/logger.service';

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
  ],
})
export class Register {
  readonly RouteNames = RouteNames;
  private authService = inject(AuthService);
  logger = inject(LoggerService);

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  handleRegister() {
    const { username, email, password, confirmPassword } =
      this.registerForm.value;

    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      this.logger.error('Form is invalid');
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      this.logger.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      this.logger.error('Passwords do not match');
      return;
    }

    this.authService.register({
      username,
      password,
      email,
    });
  }
}

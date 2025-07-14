import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { AuthInputValidators } from '../../shared/utils/validators';

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
  private notificationService = inject(NotificationService);
  readonly RouteNames = RouteNames;
  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginForm = new FormGroup({
    username: new FormControl('', [...AuthInputValidators.username]),
    password: new FormControl('', [...AuthInputValidators.password]),
  });

  handleLogin() {
    this.loginForm.markAllAsTouched();

    const { username, password } = this.loginForm.value;

    if (!username || !password) {
      this.notificationService.showNotification(
        $localize`:@@login.credentials-required:Username and password are required`
      );
      return;
    }

    if (this.loginForm.invalid) {
      this.notificationService.showNotification(
        $localize`:@@login.form-invalid:Please correct the form errors`
      );
      return;
    }

    this.authService.login({
      username: username,
      password: password,
    });
  }
}

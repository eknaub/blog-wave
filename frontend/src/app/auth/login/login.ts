import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
import { AuthInputValidators } from '../../shared/utils/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  protected readonly RouteNames = RouteNames;
  protected readonly hidePassword = signal(true);

  protected readonly loginForm = new FormGroup({
    username: new FormControl('', [...AuthInputValidators.username]),
    password: new FormControl('', [...AuthInputValidators.password]),
  });

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected handleLogin(): void {
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

    this.authService
      .login({
        username,
        password,
      })
      .subscribe({
        next: () => {
          // Login successful, navigation handled by service
        },
      });
  }
}

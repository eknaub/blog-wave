import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
import { NotificationService } from '../../shared/services/notification.service';
import { AuthInputValidators } from '../../shared/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
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
export class Register {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  protected readonly RouteNames = RouteNames;
  protected readonly hidePassword = signal(false);
  protected readonly hideConfirmPassword = signal(false);

  protected readonly registerForm = new FormGroup(
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

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((hidden) => !hidden);
  }

  private matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl?.errors && !matchingControl.errors?.['mismatch']) {
        return null;
      }

      if (control?.value !== matchingControl?.value) {
        const error = {
          mismatch: $localize`:@@register.password-mismatch:Passwords do not match.`,
        };
        matchingControl?.setErrors(error);
        return error;
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  protected handleRegister(): void {
    this.registerForm.markAllAsTouched();

    const { username, email, password, confirmPassword } =
      this.registerForm.value;

    if (!username || !email || !password || !confirmPassword) {
      this.notificationService.showNotification(
        $localize`:@@register.all-fields-required:All fields are required`
      );
      return;
    }

    if (this.registerForm.invalid) {
      this.notificationService.showNotification(
        $localize`:@@register.form-invalid:Please correct the form errors`
      );
      return;
    }

    this.authService.register({
      username,
      password,
      email,
    });
  }
}

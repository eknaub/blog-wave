import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../dashboard/services/user-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthInputValidators } from '../../shared/utils/validators';
import { NotificationService } from '../../shared/services/notification.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileStats } from '../../dashboard/features/user-profile/user-profile-stats/user-profile-stats';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatError,
    UserProfileStats,
  ],
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  protected readonly currentUser = computed(() => {
    const user = this.userService.getUserById(
      this.authService.getLoggedInUser()?.id
    );

    this.editUserForm.patchValue({
      username: user?.username || '',
      email: user?.email || '',
    });

    return user;
  });

  protected readonly editUserForm = new FormGroup({
    username: new FormControl('', [...AuthInputValidators.username]),
    email: new FormControl('', [...AuthInputValidators.email]),
  });

  protected readonly isEditing = signal(false);

  toggleEdit() {
    this.isEditing.update((editing) => !editing);
  }

  saveProfile() {
    if (!this.currentUser) {
      return;
    }

    this.editUserForm.markAllAsTouched();

    const { username, email } = this.editUserForm.value;

    if (!username || !email) {
      this.notificationService.showNotification(
        $localize`:@@profile.form.required:Username and email are required`
      );
      return;
    }

    if (this.editUserForm.invalid) {
      this.notificationService.showNotification(
        $localize`:@@profile.form.invalid:Please fix the errors in the form`
      );
      return;
    }

    this.userService.updateUser(this.currentUser()!.id, {
      username: username,
      email: email,
    });
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}

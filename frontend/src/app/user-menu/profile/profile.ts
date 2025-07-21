import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { BlogService } from '../../dashboard/services/blog-service';
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
import { User } from '../../shared/api/models';

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
  ],
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly blogService = inject(BlogService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  protected readonly currentUser = computed(() => {
    return this.userService.getUserById(this.authService.getCurrentUser()?.id);
  });

  protected readonly editUserForm = new FormGroup({
    username: new FormControl('', [...AuthInputValidators.username]),
    email: new FormControl('', [...AuthInputValidators.email]),
  });

  protected readonly isEditing = signal(false);

  protected readonly postCount = computed(() => {
    if (!this.currentUser()) {
      return 0;
    }

    return this.blogService.getPostCountByAuthor()(this.currentUser()!.id);
  });

  protected readonly followerCount = computed(() => {
    return this.currentUser()?.followersCount ?? 0;
  });

  protected readonly followingCount = computed(() => {
    return this.currentUser()?.followingCount ?? 0;
  });

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
        'Username and email are required'
      );
      return;
    }

    if (this.editUserForm.invalid) {
      this.notificationService.showNotification(
        'Please fix the errors in the form'
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

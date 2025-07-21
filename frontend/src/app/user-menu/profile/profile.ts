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

  protected readonly editUserForm = new FormGroup({
    username: new FormControl('', [...AuthInputValidators.username]),
    email: new FormControl('', [...AuthInputValidators.email]),
  });

  constructor() {
    // Watch for user changes and patch the form
    effect(() => {
      const user = this.user();
      if (user) {
        this.editUserForm.patchValue({
          username: user.username,
          email: user.email,
        });
      }
    });
  }

  protected readonly isEditing = signal(false);

  protected readonly user = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No current user found');
    }
    return this.userService.getUserById(currentUser.id);
  });

  protected readonly postCount = computed(() => {
    return this.blogService.getPostCountByAuthor()(this.user()?.id);
  });

  protected readonly followerCount = computed(() => {
    return this.user()?.followersCount ?? 0;
  });

  protected readonly followingCount = computed(() => {
    return this.user()?.followingCount ?? 0;
  });

  toggleEdit() {
    this.isEditing.update((editing) => !editing);
  }

  saveProfile() {
    if (!this.user()) {
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

    this.userService.updateUser(this.user()!.id, {
      username: username,
      email: email,
    });
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}

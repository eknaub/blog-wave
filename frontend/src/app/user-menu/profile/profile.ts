import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { BlogService } from '../../dashboard/services/blog-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly blogService = inject(BlogService);

  protected readonly user = computed(() => this.authService.getCurrentUser());
  protected readonly postCount = computed(() => {
    const user = this.user();
    if (!user || user.id === undefined || user.id === null) {
      return 0;
    }

    return this.blogService.getPostCountByAuthor()(user.id);
  });
  protected readonly isEditing = signal(false);

  toggleEdit() {
    this.isEditing.update((editing) => !editing);
  }

  saveProfile() {
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}

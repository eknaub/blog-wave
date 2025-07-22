import { Component, computed, inject, input } from '@angular/core';
import { User } from '../../../../shared/api/models';
import { BlogService } from '../../../services/blog-service';
import { MatDivider } from '@angular/material/divider';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  FollowersDialog,
  FollowersDialogType,
} from '../followers-dialog/followers-dialog';

@Component({
  selector: 'app-user-profile-stats',
  imports: [MatDivider],
  templateUrl: './user-profile-stats.html',
  styleUrl: './user-profile-stats.css',
})
export class UserProfileStats {
  readonly user = input.required<User | undefined>();
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly postCount = computed(() => {
    if (!this.user()) {
      return 0;
    }

    return this.blogService.getPostCountByAuthor()(this.user()?.id);
  });

  protected readonly followerCount = computed(() => {
    return this.user()?.followersCount ?? 0;
  });

  protected readonly followingCount = computed(() => {
    return this.user()?.followingCount ?? 0;
  });

  protected readonly navigateToPosts = () => {
    this.router.navigate(['/dashboard', 'blog']);
  };

  protected readonly openFollowersDialog = () => {
    console.log('Open followers dialog for user:', this.user()?.id);
    this.dialog.open(FollowersDialog, {
      data: {
        type: FollowersDialogType.FOLLOWERS,
      },
    });
  };

  protected readonly openFollowingDialog = () => {
    console.log('Open following dialog for user:', this.user()?.id);
    this.dialog.open(FollowersDialog, {
      data: {
        type: FollowersDialogType.FOLLOWING,
      },
    });
  };
}

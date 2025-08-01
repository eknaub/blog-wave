import { Component, computed, inject, input } from '@angular/core';
import { User } from '../../../../shared/api/models';
import { PostsService } from '../../../services/post-service';
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
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly postCount = computed(() => {
    if (!this.user()) {
      return 0;
    }

    return this.postsService.getPostCountByAuthor()(this.user()?.id);
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
    this.dialog.open(FollowersDialog, {
      data: {
        type: FollowersDialogType.FOLLOWERS,
        userId: this.user()?.id ?? 0,
      },
    });
  };

  protected readonly openFollowingDialog = () => {
    this.dialog.open(FollowersDialog, {
      data: {
        type: FollowersDialogType.FOLLOWING,
        userId: this.user()?.id ?? 0,
      },
    });
  };
}

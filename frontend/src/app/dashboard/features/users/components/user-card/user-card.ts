import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BlogService } from '../../../../services/blog-service';
import { User } from '../../../../../shared/api/models';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../../shared/services/auth.service';
import { UserFollowersService } from '../../../../services/user-followers-service';
import { UserService } from '../../../../services/user-service';
import { LoggerService } from '../../../../../shared/services/logger.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
})
export class UserCard {
  private readonly userService = inject(UserService);
  private readonly blogService = inject(BlogService);
  private readonly authService = inject(AuthService);
  private readonly userFollowersService = inject(UserFollowersService);
  private readonly logger = inject(LoggerService);

  readonly user = input.required<User>();

  protected readonly postCount = computed(() => {
    return this.blogService.getPostCountByAuthor()(this.user().id);
  });

  protected readonly followerCount = computed(() => {
    return this.user().followersCount ?? 0;
  });

  protected readonly followingCount = computed(() => {
    return this.user().followingCount ?? 0;
  });

  protected readonly navigateToUserProfile = (userId: number) => {
    this.blogService.navigateToUserProfile(userId);
  };

  protected readonly isCurrentUser = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.id === this.user().id : false;
  });

  protected readonly followUser = () => {
    if (this.isCurrentUser()) {
      return;
    }
    this.userFollowersService.followUser(this.user().id).subscribe({
      next: () => {
        this.userService.refetchUsers();
        this.userFollowersService.refetchFollowersAndFollowing();
      },
      error: (err) => {
        this.logger.error(`Failed to follow user: ${err}`);
      },
    });
  };

  protected readonly unfollowUser = () => {
    if (this.isCurrentUser()) {
      return;
    }
    this.userFollowersService.unfollowUser(this.user().id).subscribe({
      next: () => {
        this.userService.refetchUsers();
        this.userFollowersService.refetchFollowersAndFollowing();
      },
      error: (err) => {
        this.logger.error(`Failed to unfollow user: ${err}`);
      },
    });
  };

  protected readonly isFollowing = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    return this.userFollowersService.isFollowing(this.user().id);
  });
}

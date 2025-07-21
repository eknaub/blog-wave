import { inject, Injectable, signal } from '@angular/core';
import { FollowersService as GeneratedFollowersService } from '../../shared/api/services';
import { AuthService } from '../../shared/services/auth.service';
import { Follower } from '../../shared/api/models';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserFollowersService {
  private readonly followerService = inject(GeneratedFollowersService);
  private readonly authService = inject(AuthService);
  private readonly logger = inject(LoggerService);

  readonly followers = signal<Follower[]>([]);
  readonly following = signal<Follower[]>([]);

  constructor() {
    this.fetchFollowers();
    this.fetchFollowing();
  }

  refetchFollowersAndFollowing() {
    this.fetchFollowers();
    this.fetchFollowing();
  }

  private fetchFollowing() {
    const currentUserId = this.authService.getCurrentUser()?.id;
    if (!currentUserId) {
      throw new Error('No current user found');
    }
    this.followerService
      .apiUsersUserIdFollowingGet({
        userId: currentUserId,
      })
      .subscribe({
        next: (following) => {
          this.following.set(following ?? []);
        },
        error: (error) => {
          this.following.set([]);
          this.logger.error(`Failed to load following: ${error}`);
        },
      });
  }

  private fetchFollowers() {
    const currentUserId = this.authService.getCurrentUser()?.id;
    if (!currentUserId) {
      throw new Error('No current user found');
    }
    this.followerService
      .apiUsersUserIdFollowersGet({
        userId: currentUserId,
      })
      .subscribe({
        next: (followers) => {
          this.followers.set(followers ?? []);
        },
        error: (error) => {
          this.followers.set([]);
          this.logger.error(`Failed to load posts: ${error}`);
        },
      });
  }

  isFollowing(userId: number): boolean {
    return this.following().some((follower) => follower.followingId === userId);
  }

  isFollower(userId: number): boolean {
    return this.followers().some((follower) => follower.followerId === userId);
  }

  followUser(userId: number) {
    return this.followerService.apiUsersUserIdFollowersPost({
      userId: this.authService.getCurrentUser()?.id ?? 0,
      body: { followId: userId },
    });
  }

  unfollowUser(userId: number) {
    return this.followerService.apiUsersUserIdFollowersUnfollowIdDelete({
      userId: this.authService.getCurrentUser()?.id ?? 0,
      unfollowId: userId,
    });
  }
}

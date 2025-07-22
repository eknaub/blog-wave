import { effect, inject, Injectable, signal } from '@angular/core';
import { FollowersService as GeneratedFollowersService } from '../../shared/api/services';
import { Follower } from '../../shared/api/models';
import { LoggerService } from '../../shared/services/logger.service';

//TODO: This service needs rebuilding, dont like how it works

@Injectable({
  providedIn: 'root',
})
export class UserFollowersService {
  private readonly followerService = inject(GeneratedFollowersService);
  private readonly logger = inject(LoggerService);

  readonly userId = signal<number | null>(null);
  readonly followers = signal<Follower[] | null>(null);
  readonly following = signal<Follower[] | null>(null);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id !== null) {
        this.fetchFollowers(id);
        this.fetchFollowing(id);
      }
    });
  }

  setUserId(id: number) {
    this.userId.set(id);
  }

  refetchFollowersAndFollowing(userId: number) {
    if (userId === null) {
      this.logger.warn(
        'User ID is not set, cannot refetch followers and following'
      );
      return;
    }

    this.fetchFollowers(userId);
    this.fetchFollowing(userId);
  }

  fetchFollowing(userId: number) {
    if (!userId) {
      throw new Error('User ID is not set, cannot fetch following');
    }
    this.followerService
      .apiUsersUserIdFollowingGet({
        userId: userId,
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

  fetchFollowers(userId: number) {
    if (!userId) {
      throw new Error('User ID is not set, cannot fetch followers');
    }
    this.followerService
      .apiUsersUserIdFollowersGet({
        userId: userId,
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

  isFollowing(followingId: number): boolean {
    const following = this.following();

    if (!following) {
      this.logger.warn('Following list is not loaded');
      return false;
    }

    return following.some((follower) => follower.followingId === followingId);
  }

  isFollower(followerId: number): boolean {
    const followers = this.followers();

    if (!followers) {
      this.logger.warn('Followers list is not loaded');
      return false;
    }

    return followers.some((follower) => follower.followerId === followerId);
  }

  followUser(currentUserId: number, followId: number) {
    return this.followerService.apiUsersUserIdFollowersPost({
      userId: currentUserId,
      body: { followId: followId },
    });
  }

  unfollowUser(currentUserId: number, unfollowId: number) {
    return this.followerService.apiUsersUserIdFollowersUnfollowIdDelete({
      userId: currentUserId,
      unfollowId: unfollowId,
    });
  }
}

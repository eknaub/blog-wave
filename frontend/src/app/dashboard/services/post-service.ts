import { inject, Injectable, signal, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post, PostPost, PostVote } from '../../shared/api/models';
import { PostsService as GeneratedPostsService } from '../../shared/api/services/posts.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { VoteEnum } from '../../shared/interfaces/enums';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly generatedPostsService = inject(GeneratedPostsService);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly posts = signal<Post[]>([]);
  readonly postsLoading = signal(false);
  readonly postsError = signal<string | null>(null);

  readonly postVotes = signal<Record<number, PostVote[]>>({});

  private readonly loggedInUser = computed(() =>
    this.authService.getLoggedInUser()
  );

  constructor() {
    this.loadPosts();
  }

  loadPosts(): Subscription {
    this.postsLoading.set(true);
    this.postsError.set(null);
    return this.generatedPostsService.apiPostsGet().subscribe({
      next: (posts) => {
        posts.forEach((post) => {
          this.getPostVotes(post.id);
        });
        this.posts.set(posts);
        this.postsLoading.set(false);
      },
      error: (error) => {
        this.postsError.set(error.message);
        this.postsLoading.set(false);
        this.logger.error(`Failed to load posts: ${error}`);
      },
    });
  }

  uploadPost(newPost: PostPost): void {
    const user = this.loggedInUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@posts-service.post-upload-error:You must be logged in to post`
      );
      return;
    }
    this.generatedPostsService
      .apiPostsPost({
        body: { ...newPost, authorId: user.id },
      })
      .subscribe({
        next: (post) => {
          this.posts.update((posts) => [...posts, post]);
          this.notificationService.showNotification(
            $localize`:@@posts-service.post-upload-success:Post uploaded successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@posts-service.post-upload-error:Failed to upload post`
          );
          this.logger.error(`Failed to upload post: ${error}`);
        },
      });
  }

  deletePost(postId: number): void {
    this.generatedPostsService.apiPostsPostIdDelete({ postId }).subscribe({
      next: (deletedPost) => {
        this.posts.update((posts) =>
          posts.filter((p) => p.id !== deletedPost.id)
        );
        this.notificationService.showNotification(
          $localize`:@@posts-service.post-delete-success:Post deleted successfully`
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@posts-service.post-delete-error:Failed to delete post`
        );
        this.logger.error(`Failed to delete post: ${error}`);
      },
    });
  }

  votePost(postId: number, vote: VoteEnum): void {
    const user = this.loggedInUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@posts-service.vote-error:You must be logged in to vote`
      );
      return;
    }

    this.generatedPostsService
      .apiPostsPostIdVotesPost({
        postId,
        body: { value: vote },
      })
      .subscribe({
        next: (updatedPost) => {
          this.posts.update((posts) =>
            posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          );
          this.getPostVotes(postId);
          this.notificationService.showNotification(
            $localize`:@@posts-service.vote-success:Vote recorded successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@posts-service.vote-error:Failed to record vote`
          );
          this.logger.error(`Failed to record vote: ${error}`);
        },
      });
  }

  getPostVotesCount(postId: number): number {
    const post = this.posts().find((p) => p.id === postId);
    return post ? (post.votesCount ?? 0) : 0;
  }

  getPostVotes(postId: number): Subscription {
    return this.generatedPostsService
      .apiPostsPostIdVotesGet({ postId })
      .subscribe({
        next: (votes) => {
          const post = this.posts().find((p) => p.id === postId);
          if (post) {
            this.postVotes.update((current) => ({
              ...current,
              [postId]: votes,
            }));
          }
        },
        error: (error) => {
          this.logger.error(`Failed to load post votes: ${error}`);
        },
      });
  }

  hasUserVotedOnPost(postId: number, vote: VoteEnum): boolean {
    const votes = this.postVotes()[postId];
    if (!votes) return false;
    return votes.some(
      (v) => v.value === vote && v.userId === this.loggedInUser()?.id
    );
  }

  navigateToUserProfile(userId: number): void {
    this.router.navigate(['/dashboard', 'user-profile', userId]);
  }

  getPostCountByAuthor = computed(() => (authorId?: number) => {
    return (
      this.posts().filter((post) => post.author.id === authorId).length || 0
    );
  });
}

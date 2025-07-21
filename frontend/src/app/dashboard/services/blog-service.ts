import { inject, Injectable, signal, computed } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Comment, CommentPost, Post, PostPost } from '../../shared/api/models';
import { PostsService as GeneratedPostsService } from '../../shared/api/services/posts.service';
import { CommentsService as GeneratedCommentsService } from '../../shared/api/services/comments.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly authService = inject(AuthService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);
  private readonly generatedPostsService = inject(GeneratedPostsService);
  private readonly generatedCommentsService = inject(GeneratedCommentsService);
  private readonly router = inject(Router);

  private readonly commentsSignals = new Map<
    number,
    ReturnType<typeof signal<Comment[]>>
  >();

  readonly posts = signal<Post[]>([]);
  readonly postsLoading = signal(false);
  readonly postsError = signal<string | null>(null);

  private readonly currentUser = computed(() =>
    this.authService.getCurrentUser()
  );

  navigateToUserProfile(userId: number): void {
    this.router.navigate(['/dashboard', 'user-profile', userId]);
  }

  constructor() {
    this.loadPosts();
  }

  private loadPosts(): Subscription {
    this.postsLoading.set(true);
    this.postsError.set(null);

    return this.generatedPostsService.apiPostsGet().subscribe({
      next: (posts) => {
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

  getCommentsByPostId(postId: number) {
    if (!this.commentsSignals.has(postId)) {
      const commentsSignal = signal<Comment[]>([]);
      this.commentsSignals.set(postId, commentsSignal);
    }
    return this.commentsSignals.get(postId)!;
  }

  loadCommentsForPost(postId: number): void {
    const commentsSignal = this.getCommentsByPostId(postId);

    this.generatedCommentsService
      .apiPostsPostIdCommentsGet({
        postId,
      })
      .subscribe({
        next: (comments) => commentsSignal.set(comments),
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@blog-service.load-comments-error:Failed to load comments`
          );
          this.logger.error(
            `Failed to load comments for post ${postId}: ${error}`
          );
        },
      });
  }

  getPostCountByAuthor = computed(() => (authorId?: number) => {
    return (
      this.posts().filter((post) => post.author.id === authorId).length || 0
    );
  });

  uploadPost(title: string, content: string): void {
    const user = this.currentUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@blog-service.post-upload-error:You must be logged in to post`
      );
      return;
    }

    const newPost: PostPost = {
      title,
      content,
      authorId: user.id,
    };

    this.generatedPostsService.apiPostsPost({ body: newPost }).subscribe({
      next: (post) => {
        this.posts.update((posts) => [...posts, post]);
        this.notificationService.showNotification(
          $localize`:@@blog-service.post-upload-success:Post uploaded successfully`
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@blog-service.post-upload-error:Failed to upload post`
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
          $localize`:@@blog-service.post-delete-success:Post deleted successfully`
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@blog-service.post-delete-error:Failed to delete post`
        );
        this.logger.error(`Failed to delete post: ${error}`);
      },
    });
  }

  uploadCommentToPost(postId: number, content: string): void {
    const user = this.currentUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@blog-service.comment-upload-error:You must be logged in to comment`
      );
      return;
    }

    const newComment: CommentPost = {
      postId,
      authorId: user.id,
      content,
    };

    this.generatedCommentsService
      .apiPostsPostIdCommentsPost({
        postId,
        body: newComment,
      })
      .subscribe({
        next: (comment) => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) => [...comments, comment]);
          } else {
            this.commentsSignals.set(postId, signal([comment]));
          }
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-upload-success:Comment uploaded successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-upload-error:Failed to upload comment`
          );
          this.logger.error(`Failed to upload comment: ${error}`);
        },
      });
  }

  deleteComment(postId: number, commentId: number): void {
    this.generatedCommentsService
      .apiPostsPostIdCommentsCommentIdDelete({ postId, commentId })
      .subscribe({
        next: () => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) =>
              comments.filter((c) => c.id !== commentId)
            );
          }
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-delete-success:Comment deleted successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-delete-error:Failed to delete comment`
          );
          this.logger.error(`Failed to delete comment: ${error}`);
        },
      });
  }
}

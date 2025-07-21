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

  readonly currentUser = computed(() => this.authService.getCurrentUser());

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

  uploadPost(title: string, content: string): Observable<Post> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newPost: PostPost = {
      title,
      content,
      authorId: user.id,
    };

    return this.generatedPostsService
      .apiPostsPost({
        body: newPost,
      })
      .pipe(
        map((post) => {
          this.posts.update((posts) => [...posts, post]);
          this.notificationService.showNotification(
            $localize`:@@blog-service.post-upload-success:Post uploaded successfully`
          );
          return post;
        })
      );
  }

  deletePost(postId: number): Observable<Post> {
    return this.generatedPostsService
      .apiPostsPostIdDelete({
        postId,
      })
      .pipe(
        map((post) => {
          this.posts.update((posts) => posts.filter((p) => p.id !== postId));
          this.notificationService.showNotification(
            $localize`:@@blog-service.post-delete-success:Post deleted successfully`
          );
          return post;
        })
      );
  }

  uploadCommentToPost(postId: number, comment: string): Observable<Comment> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newComment: CommentPost = {
      postId,
      authorId: user.id,
      content: comment,
    };

    return this.generatedCommentsService
      .apiPostsPostIdCommentsPost({
        postId,
        body: newComment,
      })
      .pipe(
        map((comment) => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) => [...comments, comment]);
          } else {
            this.commentsSignals.set(postId, signal([comment]));
          }
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-upload-success:Comment uploaded successfully`
          );
          return comment;
        })
      );
  }

  deleteComment(postId: number, commentId: number): Observable<Comment> {
    return this.generatedCommentsService
      .apiPostsPostIdCommentsCommentIdDelete({
        postId,
        commentId,
      })
      .pipe(
        map((comment) => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) =>
              comments.filter((c) => c.id !== commentId)
            );
          }
          this.notificationService.showNotification(
            $localize`:@@blog-service.comment-delete-success:Comment deleted successfully`
          );
          return comment;
        })
      );
  }
}

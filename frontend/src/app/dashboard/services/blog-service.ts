import { inject, Injectable, signal, computed } from '@angular/core';
import { Post, PostCreate } from '../../shared/interfaces/post';
import { Comment, CommentCreate } from '../../shared/interfaces/comment';
import { map, Observable, Subscription } from 'rxjs';
import { BaseHttpService } from '../../shared/services/http.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly baseHttp = inject(BaseHttpService);
  private readonly authService = inject(AuthService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);

  private readonly commentsSignals = new Map<
    number,
    ReturnType<typeof signal<Comment[]>>
  >();

  readonly posts = signal<Post[]>([]);
  readonly postsLoading = signal(false);
  readonly postsError = signal<string | null>(null);

  readonly currentUser = computed(() => this.authService.getCurrentUser());

  constructor() {
    this.loadPosts();
  }

  private loadPosts(): Subscription {
    this.postsLoading.set(true);
    this.postsError.set(null);

    return this.baseHttp.get<Post[]>('/posts').subscribe({
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

    this.baseHttp.get<Comment[]>(`/posts/${postId}/comments`).subscribe({
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

  getPostCountByAuthor = computed(() => (authorId: number) => {
    return this.posts().filter((post) => post.authorId === authorId).length;
  });

  uploadPost(title: string, content: string): Observable<Post> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newPost: PostCreate = {
      title,
      content,
      authorId: user.id,
    };

    return this.baseHttp.post<Post>('/posts', newPost).pipe(
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
    return this.baseHttp.delete<Post>(`/posts/${postId}`).pipe(
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

    const newComment: CommentCreate = {
      postId,
      authorId: user.id,
      content: comment,
    };

    return this.baseHttp
      .post<Comment>(`/posts/${postId}/comments`, newComment)
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
    return this.baseHttp
      .delete<Comment>(`/posts/${postId}/comments/${commentId}`)
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

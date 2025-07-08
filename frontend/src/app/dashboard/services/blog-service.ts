import { inject, Injectable, signal } from '@angular/core';
import { Post, PostCreate } from '../../shared/interfaces/post';
import { Comment, CommentCreate } from '../../shared/interfaces/comment';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../shared/services/http.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseHttp = inject(BaseHttpService);
  private commentsSignals = new Map<
    number,
    ReturnType<typeof signal<Comment[]>>
  >();
  posts = signal<Post[]>([]);
  postsLoading = signal<boolean>(false);
  postsError = signal<string | null>(null);
  authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();
  notificationService = inject(NotificationService);

  constructor() {
    this.loadPosts();
  }

  private loadPosts() {
    this.postsLoading.set(true);
    return this.baseHttp.get<Post[]>('/posts').subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.postsLoading.set(false);
      },
      error: (error) => {
        this.postsError.set(error.message || 'Failed to load posts');
        this.postsLoading.set(false);
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

  loadCommentsForPost(postId: number) {
    const commentsSignal = this.getCommentsByPostId(postId);

    this.baseHttp.get<Comment[]>(`/posts/${postId}/comments`).subscribe({
      next: (comments) => commentsSignal.set(comments),
      error: (error) => console.error('Failed to load comments:', error),
    });
  }

  getPostCountByAuthor(authorId: number) {
    return this.posts().filter((post) => post.authorId === authorId).length;
  }

  uploadPost(title: string, content: string): Observable<Post> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const newPost: PostCreate = {
      title,
      content,
      authorId: this.currentUser.id,
    };

    return this.baseHttp.post<Post>('/posts', newPost).pipe(
      map((post) => {
        this.posts.update((posts) => [...posts, post]);
        this.notificationService.showNotification('Post created successfully');
        return post;
      })
    );
  }

  deletePost(postId: number): Observable<void> {
    return this.baseHttp.delete<Post>(`/posts/${postId}`).pipe(
      map(() => {
        this.posts.update((posts) =>
          posts.filter((post) => post.id !== postId)
        );
        this.notificationService.showNotification('Post deleted successfully');
      })
    );
  }

  uploadCommentToPost(
    postId: number,
    comment: string
  ): Observable<CommentCreate> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const newComment: CommentCreate = {
      postId: postId,
      authorId: this.currentUser?.id,
      content: comment,
    };

    return this.baseHttp
      .post<Comment>(`/posts/${postId}/comments`, newComment)
      .pipe(
        map((comment) => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) => [...comments, comment]);
          }
          this.notificationService.showNotification(
            'Comment added successfully'
          );
          return comment;
        })
      );
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.baseHttp
      .delete<Comment>(`/posts/${postId}/comments/${commentId}`)
      .pipe(
        map(() => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) =>
              comments.filter((comment) => comment.id !== commentId)
            );
          }
          this.notificationService.showNotification(
            'Comment deleted successfully'
          );
        })
      );
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { Post } from '../../shared/interfaces/post';
import { Comment } from '../../shared/interfaces/comment';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseHttp = inject(BaseHttpService);
  private commentsCache = new Map<number, Observable<Comment[]>>();
  posts = signal<Post[]>([]);
  postsLoading = signal<boolean>(false);
  postsError = signal<string | null>(null);

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
    if (!this.commentsCache.has(postId)) {
      const comments$ = this.baseHttp.get<Comment[]>(
        `/posts/${postId}/comments`
      );
      this.commentsCache.set(postId, comments$);
    }
    return this.commentsCache.get(postId);
  }

  getPostCountByAuthor(authorId: number) {
    return this.posts().filter((post) => post.author_id === authorId).length;
  }
}

import { inject, Injectable } from '@angular/core';
import { Post } from '../../shared/interfaces/post';
import { Comment } from '../../shared/interfaces/comment';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  httpService = inject(HttpClient);
  posts = httpResource<Post[]>(() => `${environment.apiUrl}/posts`);
  commentsCache = new Map<number, Observable<Comment[]>>();

  getPosts() {
    return this.posts;
  }

  getCommentsByPostId(postId: number) {
    if (!this.commentsCache.has(postId)) {
      const comments$ = this.httpService
        .get<Comment[]>(`${environment.apiUrl}/posts/${postId}/comments`)
        .pipe(shareReplay(1));
      this.commentsCache.set(postId, comments$);
    }
    return this.commentsCache.get(postId);
  }

  getPostCountByAuthor(authorId: number) {
    return this.posts.value()?.filter((post) => post.authorId === authorId)
      .length;
  }
}

import { inject, Injectable } from '@angular/core';
import { Post } from '../../shared/interfaces/post';
import { Comment } from '../../shared/interfaces/comment';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private httpService = inject(HttpClient);
  private commentsCache = new Map<number, Observable<Comment[]>>();

  posts = httpResource<Post[]>(() => ({
    url: `${environment.apiUrl}/posts`,
  }));

  getCommentsByPostId(postId: number) {
    if (!this.commentsCache.has(postId)) {
      const comments$ = this.httpService.get<Comment[]>(
        `${environment.apiUrl}/posts/${postId}/comments`
      );
      this.commentsCache.set(postId, comments$);
    }
    return this.commentsCache.get(postId);
  }

  getPostCountByAuthor(authorId: number) {
    return this.posts.value()?.filter((post) => post.authorId === authorId)
      .length;
  }
}

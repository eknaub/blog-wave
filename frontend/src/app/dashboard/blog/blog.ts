import { Component, inject } from '@angular/core';
import { BlogService } from '../services/blog-service';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog',
  imports: [AsyncPipe, MatProgressSpinner],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blogService = inject(BlogService);

  posts = this.blogService.posts;

  getCommentsForPost(postId: number) {
    return this.blogService.getCommentsByPostId(postId);
  }
}

import { Component, inject } from '@angular/core';
import { BlogService } from '../services/blog-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [AsyncPipe],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blogService = inject(BlogService);

  posts = this.blogService.getPosts();

  getCommentsForPost(postId: number) {
    return this.blogService.getCommentsByPostId(postId);
  }
}

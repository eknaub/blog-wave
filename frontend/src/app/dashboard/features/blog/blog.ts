import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';
import { BlogService } from '../../services/blog-service';

@Component({
  selector: 'app-blog',
  imports: [AsyncPipe, DashboardContentWrapper],
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

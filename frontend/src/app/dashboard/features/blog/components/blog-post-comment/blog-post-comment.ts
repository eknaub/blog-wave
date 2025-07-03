import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { BlogService } from '../../../../services/blog-service';

@Component({
  selector: 'app-blog-post-comment',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './blog-post-comment.html',
  styleUrl: './blog-post-comment.css',
})
export class BlogPostComment {
  blogService = inject(BlogService);
  postId = input.required<number>();

  comments = computed(() => {
    return this.blogService.getCommentsByPostId(this.postId());
  });
}

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { BlogService } from '../../../../services/blog-service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-blog-post-comment',
  imports: [AsyncPipe, CommonModule, MatExpansionModule],
  templateUrl: './blog-post-comment.html',
  styleUrl: './blog-post-comment.css',
})
export class BlogPostComment {
  blogService = inject(BlogService);
  postId = input.required<number>();
  panelState = signal(false);

  comments = computed(() => {
    return this.blogService.getCommentsByPostId(this.postId());
  });
}

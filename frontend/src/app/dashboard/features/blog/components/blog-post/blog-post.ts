import { Component, inject, input } from '@angular/core';
import { BlogPostComment } from '../blog-post-comment/blog-post-comment';
import { Post } from '../../../../../shared/interfaces/post';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { BlogService } from '../../../../services/blog-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  imports: [
    BlogPostComment,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class BlogPost {
  post = input.required<Post>();
  blogService = inject(BlogService);
  currentUser = this.blogService.currentUser;

  deletePost = () => {
    this.blogService.deletePost(this.post().id).subscribe({
      next: () => {
        console.log('Post deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete post:', error);
      },
    });
  };
}

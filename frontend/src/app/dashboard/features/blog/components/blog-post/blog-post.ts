import { Component, inject, input } from '@angular/core';
import { BlogPostComment } from '../blog-post-comment/blog-post-comment';
import { Post } from '../../../../../shared/interfaces/post';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { BlogService } from '../../../../services/blog-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '../../../../../shared/services/logger.service';
import { NotificationService } from '../../../../../shared/services/notification.service';

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
  logger = inject(LoggerService);
  notificationService = inject(NotificationService);

  deletePost = () => {
    this.blogService.deletePost(this.post().id).subscribe({
      next: () => {
        this.notificationService.showNotification(
          $localize`:@@blog-post.delete-success:Post deleted successfully`
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@blog-post.delete-error:Failed to delete post`
        );
        this.logger.error(`Failed to delete post: ${error}`);
      },
    });
  };
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BlogPostComment } from '../blog-post-comment/blog-post-comment';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../services/blog-service';
import { LoggerService } from '../../../../shared/services/logger.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Post } from '../../../../shared/interfaces/post';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlogPostComment,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
})
export class BlogPost {
  readonly post = input.required<Post>();

  private readonly blogService = inject(BlogService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);

  protected readonly currentUser = this.blogService.currentUser;

  protected readonly canDeletePost = computed(
    () => this.post().authorId === this.currentUser()?.id
  );

  protected readonly formattedContent = computed(() =>
    this.post().content.replace(/\n/g, '<br>')
  );

  protected readonly wasUpdated = computed(
    () => this.post().updatedAt !== this.post().createdAt
  );

  protected deletePost = (): void => {
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

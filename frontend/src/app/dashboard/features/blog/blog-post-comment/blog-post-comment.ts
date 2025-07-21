import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { effect } from '@angular/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { BlogService } from '../../../services/blog-service';
import { LoggerService } from '../../../../shared/services/logger.service';
import { CommentInputValidators } from '../../../../shared/utils/validators';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-blog-post-comment',
  templateUrl: './blog-post-comment.html',
  styleUrl: './blog-post-comment.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    DatePipe,
  ],
})
export class BlogPostComment {
  readonly postId = input.required<number>();

  private readonly blogService = inject(BlogService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);

  protected readonly currentUser = this.authService.getCurrentUser();
  protected readonly panelState = signal(false);

  protected readonly commentForm = new FormGroup({
    comment: new FormControl('', [...CommentInputValidators.comment]),
  });

  protected readonly comments = computed(() => {
    return this.blogService.getCommentsByPostId(this.postId())();
  });

  constructor() {
    effect(() => {
      const id = this.postId();
      if (id) {
        this.blogService.loadCommentsForPost(id);
      }
    });
  }

  protected canDeleteComment = computed(() => (commentAuthorId: number) => {
    return this.currentUser?.id === commentAuthorId;
  });

  protected submitComment = (): void => {
    this.commentForm.markAllAsTouched();

    if (!this.commentForm.valid || !this.commentForm.value.comment) {
      this.notificationService.showNotification(
        $localize`:@@blog-post-comment.invalid-comment:Comment is invalid`
      );
      return;
    }

    this.blogService.uploadCommentToPost(
      this.postId(),
      this.commentForm.value.comment
    );

    this.commentForm.reset();
  };

  protected deleteComment = (commentId: number): void => {
    this.blogService.deleteComment(this.postId(), commentId);
  };
}

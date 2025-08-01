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
import { CommentInputValidators } from '../../../../shared/utils/validators';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommentsService } from '../../../services/comment-service';
import { VoteEnum } from '../../../../shared/interfaces/enums';

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

  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  protected readonly VoteEnum = VoteEnum;

  protected readonly currentUser = this.authService.getLoggedInUser();
  protected readonly panelState = signal(false);

  protected readonly commentForm = new FormGroup({
    comment: new FormControl('', [...CommentInputValidators.comment]),
  });

  protected readonly comments = computed(() => {
    return this.commentsService.getCommentsByPostId(this.postId())();
  });

  constructor() {
    effect(() => {
      const id = this.postId();
      if (id) {
        this.commentsService.loadCommentsForPost(id);
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

    this.commentsService.uploadCommentToPost(
      this.postId(),
      this.commentForm.value.comment
    );

    this.commentForm.reset();
  };

  protected deleteComment = (commentId: number): void => {
    this.commentsService.deleteComment(this.postId(), commentId);
  };

  protected vote = (commentId: number, vote: VoteEnum) => {
    this.commentsService.voteComment(this.postId(), commentId, vote);
  };

  protected getVotesCount = (commentId: number) =>
    computed(() => this.commentsService.getCommentVotesCount(commentId))();

  protected hasUserLikedPost = (commentId: number) => {
    return computed(() => {
      return this.commentsService.hasUserVotedOnComment(
        commentId,
        VoteEnum.LIKE
      );
    })();
  };

  protected hasUserDislikedPost = (commentId: number) => {
    return computed(() => {
      return this.commentsService.hasUserVotedOnComment(
        commentId,
        VoteEnum.DISLIKE
      );
    })();
  };
}

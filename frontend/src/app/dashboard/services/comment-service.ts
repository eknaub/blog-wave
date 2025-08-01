import { inject, Injectable, signal } from '@angular/core';
import { Comment, CommentPost, CommentVote } from '../../shared/api/models';
import { CommentsService as GeneratedCommentsService } from '../../shared/api/services/comments.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AuthService } from '../../shared/services/auth.service';
import { VoteEnum } from '../../shared/interfaces/enums';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly generatedCommentsService = inject(GeneratedCommentsService);
  private readonly notificationService = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly authService = inject(AuthService);

  private readonly commentsSignals = new Map<
    number,
    ReturnType<typeof signal<Comment[]>>
  >();

  readonly commentVotes = signal<Record<number, CommentVote[]>>({});
  readonly commentVoteCounts = signal<Record<number, number>>({});

  private readonly loggedInUser = signal(this.authService.getLoggedInUser());

  getCommentsByPostId(postId: number) {
    if (!this.commentsSignals.has(postId)) {
      const commentsSignal = signal<Comment[]>([]);
      this.commentsSignals.set(postId, commentsSignal);
    }
    return this.commentsSignals.get(postId)!;
  }

  loadCommentsForPost(postId: number): void {
    const commentsSignal = this.getCommentsByPostId(postId);
    this.generatedCommentsService
      .apiPostsPostIdCommentsGet({ postId })
      .subscribe({
        next: (comments) => {
          commentsSignal.set(comments);
          comments.forEach((comment) => {
            this.getCommentVotes(postId, comment);
          });
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.load-comments-error:Failed to load comments`
          );
          this.logger.error(
            `Failed to load comments for post ${postId}: ${error}`
          );
        },
      });
  }

  uploadCommentToPost(postId: number, content: string): void {
    const user = this.loggedInUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@comments-service.comment-upload-error:You must be logged in to comment`
      );
      return;
    }
    const newComment: CommentPost = { postId, authorId: user.id, content };
    this.generatedCommentsService
      .apiPostsPostIdCommentsPost({
        postId,
        body: newComment,
      })
      .subscribe({
        next: (comment) => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) => [...comments, comment]);
          } else {
            this.commentsSignals.set(postId, signal([comment]));
          }
          this.notificationService.showNotification(
            $localize`:@@comments-service.comment-upload-success:Comment uploaded successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.comment-upload-error:Failed to upload comment`
          );
          this.logger.error(`Failed to upload comment: ${error}`);
        },
      });
  }

  deleteComment(postId: number, commentId: number): void {
    this.generatedCommentsService
      .apiPostsPostIdCommentsCommentIdDelete({ postId, commentId })
      .subscribe({
        next: () => {
          const commentsSignal = this.commentsSignals.get(postId);
          if (commentsSignal) {
            commentsSignal.update((comments) =>
              comments.filter((c) => c.id !== commentId)
            );
          }
          this.notificationService.showNotification(
            $localize`:@@comments-service.comment-delete-success:Comment deleted successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.comment-delete-error:Failed to delete comment`
          );
          this.logger.error(`Failed to delete comment: ${error}`);
        },
      });
  }

  voteComment(postId: number, commentId: number, vote: VoteEnum): void {
    const user = this.loggedInUser();
    if (!user) {
      this.notificationService.showNotification(
        $localize`:@@comments-service.vote-error:You must be logged in to vote`
      );
      return;
    }

    this.generatedCommentsService
      .apiPostsPostIdCommentsCommentIdVotesPost({
        postId,
        commentId,
        body: { value: vote },
      })
      .subscribe({
        next: (comment) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.vote-success:Vote recorded successfully`
          );
          this.getCommentVotes(postId, comment);
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.vote-error:Failed to record vote`
          );
          this.logger.error(`Failed to vote on comment ${commentId}: ${error}`);
        },
      });
  }

  getCommentVotesCount(commentId: number): number {
    return this.commentVoteCounts()[commentId] ?? 0;
  }

  getCommentVotes(postId: number, comment: Comment): void {
    this.generatedCommentsService
      .apiPostsPostIdCommentsCommentIdVotesGet({
        postId,
        commentId: comment.id,
      })
      .subscribe({
        next: (votes) => {
          this.commentVotes.update((current) => ({
            ...current,
            [comment.id]: votes,
          }));

          this.commentVoteCounts.update((current) => ({
            ...current,
            [comment.id]: comment.votesCount ?? 0,
          }));
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@comments-service.get-votes-error:Failed to load comment votes`
          );
          this.logger.error(
            `Failed to load votes for comment ${comment.id}: ${error}`
          );
        },
      });
  }

  hasUserVotedOnComment(commentId: number, vote: VoteEnum): boolean {
    const votes = this.commentVotes()[commentId];
    if (!votes) return false;
    return votes.some(
      (v) => v.value === vote && v.userId === this.loggedInUser()?.id
    );
  }
}

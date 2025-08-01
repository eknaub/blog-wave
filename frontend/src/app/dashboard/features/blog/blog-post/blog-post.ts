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
import { PostsService } from '../../../services/post-service';
import { Post } from '../../../../shared/api/models';
import { AuthService } from '../../../../shared/services/auth.service';
import { VoteEnum } from '../../../../shared/interfaces/enums';

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

  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  protected readonly VoteEnum = VoteEnum;
  protected readonly currentUser = this.authService.getLoggedInUser();

  protected readonly canDeletePost = computed(
    () => this.post().author.id === this.currentUser?.id
  );

  protected readonly formattedContent = computed(() =>
    this.post().content.replace(/\n/g, '<br>')
  );

  protected readonly wasUpdated = computed(
    () => this.post().updatedAt !== this.post().createdAt
  );

  protected deletePost = (): void => {
    this.postsService.deletePost(this.post().id);
  };

  protected vote = (vote: VoteEnum) => {
    this.postsService.votePost(this.post().id, vote);
  };

  protected getVotesCount = computed(() => {
    return this.postsService.getPostVotesCount(this.post().id);
  });

  protected hasUserLikedPost = computed(() => {
    return this.postsService.hasUserVotedOnPost(this.post().id, VoteEnum.LIKE);
  });

  protected hasUserDislikedPost = computed(() => {
    return this.postsService.hasUserVotedOnPost(
      this.post().id,
      VoteEnum.DISLIKE
    );
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Post } from '../../shared/api/models';
import { PostsService } from '../../dashboard/services/post-service';
import { AuthService } from '../../shared/services/auth.service';
import { VoteEnum } from '../../shared/interfaces/enums';
import { BlogPostComment } from '../blog-home-post-comment/blog-home-post-comment';

@Component({
  selector: 'app-blog-home-post',
  templateUrl: './blog-home-post.html',
  styleUrl: './blog-home-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    BlogPostComment,
  ],
})
export class BlogHomePost {
  readonly post = input.required<Post>();

  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  protected readonly VoteEnum = VoteEnum;
  protected readonly currentUser = this.authService.getLoggedInUser();

  protected readonly formattedContent = computed(() =>
    this.post().content.replace(/\n/g, '<br>')
  );

  protected readonly wasUpdated = computed(
    () => this.post().updatedAt !== this.post().createdAt
  );

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

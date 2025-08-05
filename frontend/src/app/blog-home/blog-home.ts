import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { PostsService } from '../dashboard/services/post-service';
import { BlogHomePost } from './blog-home-post/blog-home-post';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogHomePost],
})
export class BlogHome {
  private readonly postsService = inject(PostsService);

  protected readonly posts = computed(() => this.postsService.posts());
  protected readonly postsLoading = this.postsService.postsLoading;
  protected readonly postsError = this.postsService.postsError;

  constructor() {
    effect(() => {
      this.postsService.loadPosts({
        published: true,
      });
    });
  }
}

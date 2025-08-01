import { inject, Injectable, computed } from '@angular/core';
import { PostsService } from './post-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);

  readonly postsServiceError = computed(() => this.postsService.postsError());
  readonly userServiceError = computed(() => this.userService.usersError());

  readonly isLoading = computed(
    () => this.postsService.postsLoading() || this.userService.usersLoading()
  );

  readonly posts = computed(() => this.postsService.posts().length);

  readonly users = computed(() => this.userService.users().length);
}

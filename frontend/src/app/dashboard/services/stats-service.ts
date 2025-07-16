import { inject, Injectable, computed } from '@angular/core';
import { BlogService } from './blog-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly blogService = inject(BlogService);
  private readonly userService = inject(UserService);

  readonly blogServiceError = computed(() => this.blogService.postsError());
  readonly userServiceError = computed(() => this.userService.usersError());

  readonly isLoading = computed(
    () => this.blogService.postsLoading() || this.userService.usersLoading()
  );

  readonly posts = computed(() => this.blogService.posts().length);

  readonly users = computed(() => this.userService.users().length);
}

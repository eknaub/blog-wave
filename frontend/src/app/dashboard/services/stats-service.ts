import { inject, Injectable, computed } from '@angular/core';
import { BlogService } from './blog-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private blogService = inject(BlogService);
  private userService = inject(UserService);

  blogServiceError = computed(() => this.blogService.posts.error());
  userServiceError = computed(() => this.userService.users.error());

  isLoading = computed(
    () =>
      this.blogService.posts.isLoading() || this.userService.users.isLoading()
  );

  posts = computed(() => {
    const posts = this.blogService.posts;
    return posts.hasValue() ? posts.value().length : 0;
  });

  users = computed(() => {
    const users = this.userService.users;
    return users.hasValue() ? users.value().length : 0;
  });
}

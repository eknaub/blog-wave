import { inject, Injectable, computed } from '@angular/core';
import { BlogService } from './blog-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private blogService = inject(BlogService);
  private userService = inject(UserService);

  blogServiceError = computed(() => this.blogService.postsError());
  userServiceError = computed(() => this.userService.usersError());

  isLoading = computed(
    () => this.blogService.postsLoading() || this.userService.usersLoading()
  );

  posts = computed(() => {
    const posts = this.blogService.posts;
    return posts().length;
  });

  users = computed(() => {
    const users = this.userService.users;
    return users().length;
  });
}

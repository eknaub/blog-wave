import { inject, Injectable, computed } from '@angular/core';
import { BlogService } from './blog-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  blogService = inject(BlogService);
  userService = inject(UserService);

  totalPosts = computed(() => {
    const posts = this.blogService.getPosts();
    return posts.hasValue() ? posts.value()!.length : 0;
  });

  totalUsers = computed(() => {
    const users = this.userService.getUsers();
    return users.hasValue() ? users.value()!.length : 0;
  });
}

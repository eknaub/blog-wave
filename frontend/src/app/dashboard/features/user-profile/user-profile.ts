import { Component, computed, inject, signal } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { UserService } from '../../services/user-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  private readonly blogService = inject(BlogService);
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userId = signal<number | null>(null);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.userId.set(parseInt(params['id']));
    });
  }

  protected readonly user = computed(() => {
    return this.userService.getUserById(this.userId());
  });

  protected readonly postCount = computed(() => {
    return this.blogService.getPostCountByAuthor()(this.user()?.id);
  });

  protected readonly followerCount = computed(() => {
    return this.user()?.followersCount ?? 0;
  });

  protected readonly followingCount = computed(() => {
    return this.user()?.followingCount ?? 0;
  });
}

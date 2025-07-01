import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { BlogService } from '../../services/blog-service';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.css',
  imports: [DashboardContentWrapper],
})
export class Users {
  userService = inject(UserService);
  blogService = inject(BlogService);

  users = this.userService.users;

  getPostCountByAuthor(authorId: number) {
    return this.blogService.getPostCountByAuthor(authorId);
  }
}

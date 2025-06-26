import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { BlogService } from '../services/blog-service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  userService = inject(UserService);
  blogService = inject(BlogService);

  users = this.userService.getUsers();

  getPostCountForAuthor(authorId: number) {
    return this.blogService.getPostCountByAuthor(authorId);
  }
}

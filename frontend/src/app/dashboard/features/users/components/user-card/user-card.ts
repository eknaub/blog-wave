import { Component, computed, inject, input } from '@angular/core';
import { User } from '../../../../../shared/interfaces/user';
import { BlogService } from '../../../../services/blog-service';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  blogService = inject(BlogService);
  user = input.required<User>();
  postCount = computed(() => {
    return this.blogService.getPostCountByAuthor(this.user().id);
  });
}

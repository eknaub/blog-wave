import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { User } from '../../../../../shared/interfaces/user';
import { BlogService } from '../../../../services/blog-service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  private readonly blogService = inject(BlogService);

  readonly user = input.required<User>();

  protected readonly postCount = computed(() => {
    return this.blogService.getPostCountByAuthor()(this.user().id);
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { BlogService } from '../../../../services/blog-service';
import { User } from '../../../../../shared/api/models';

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

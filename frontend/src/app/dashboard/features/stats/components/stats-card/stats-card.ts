import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { StatsService } from '../../../../services/stats-service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../../../../shared/interfaces/routes';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterLink],
})
export class StatsCard {
  private readonly statsService = inject(StatsService);

  protected readonly RouteNames = RouteNames;
  protected readonly totalPosts = this.statsService.posts;
  protected readonly totalUsers = this.statsService.users;

  protected readonly hasErrors = computed(() => {
    return (
      this.statsService.blogServiceError() ||
      this.statsService.userServiceError()
    );
  });
}

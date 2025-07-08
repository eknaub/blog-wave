import { Component, computed, inject } from '@angular/core';
import { StatsService } from '../../../../services/stats-service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../../../../shared/interfaces/routes';

@Component({
  selector: 'app-stats-card',
  imports: [MatIconModule, RouterLink],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  readonly RouteNames = RouteNames;
  statsService = inject(StatsService);

  totalPosts = this.statsService.posts;
  totalUsers = this.statsService.users;

  hasErrors = computed(() => {
    return (
      this.statsService.blogServiceError() ||
      this.statsService.userServiceError()
    );
  });
}

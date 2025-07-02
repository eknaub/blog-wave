import { Component, computed, inject } from '@angular/core';
import { StatsService } from '../../../../services/stats-service';

@Component({
  selector: 'app-stats-card',
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
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

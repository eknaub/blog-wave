import { Component, computed, inject } from '@angular/core';
import { StatsService } from '../../services/stats-service';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';

@Component({
  selector: 'app-blog-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
  imports: [DashboardContentWrapper],
})
export class Stats {
  statsService = inject(StatsService);
  stats = this.statsService;

  totalPosts = this.statsService.posts;
  totalUsers = this.statsService.users;
  hasErrors = computed(() => {
    return (
      this.statsService.blogServiceError() ||
      this.statsService.userServiceError()
    );
  });
}

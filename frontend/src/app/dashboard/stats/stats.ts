import { Component, inject } from '@angular/core';
import { StatsService } from '../services/stats-service';

@Component({
  selector: 'app-blog-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  statsService = inject(StatsService);

  totalPosts = this.statsService.totalPosts;
  totalUsers = this.statsService.totalUsers;
}

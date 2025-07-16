import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { StatsService } from '../../services/stats-service';
import { DashboardContentWrapper } from '../../dashboard-content-wrapper/dashboard-content-wrapper';
import { StatsCard } from './components/stats-card/stats-card';

@Component({
  selector: 'app-blog-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardContentWrapper, StatsCard],
})
export class Stats {
  private readonly statsService = inject(StatsService);

  protected readonly stats = this.statsService;

  protected readonly hasErrors = computed(() => {
    return (
      this.statsService.blogServiceError() ||
      this.statsService.userServiceError()
    );
  });
}

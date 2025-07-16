import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-wrapper',
  templateUrl: './dashboard-content-wrapper.html',
  styleUrl: './dashboard-content-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContentWrapper {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-wrapper',
  imports: [],
  templateUrl: './dashboard-content-wrapper.html',
  styleUrl: './dashboard-content-wrapper.css',
})
export class DashboardContentWrapper {
  title = input.required<string>();
  subtitle = input<string>();
}

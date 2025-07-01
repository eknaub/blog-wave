import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-wrapper',
  imports: [],
  templateUrl: './dashboard-content-wrapper.html',
  styleUrl: './dashboard-content-wrapper.css',
})
export class DashboardContentWrapper {
  @Input() title?: string;
  @Input() subtitle?: string;
}

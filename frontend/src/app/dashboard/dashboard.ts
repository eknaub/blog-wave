import { Component } from '@angular/core';
import { DashboardNavigation } from './dashboard-navigation/dashboard-navigation';

@Component({
  selector: 'app-blog-dashboard',
  template: ` <app-blog-dashboard-navigation /> `,
  imports: [DashboardNavigation],
})
export class Dashboard {}

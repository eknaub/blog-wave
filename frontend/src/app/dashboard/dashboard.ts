import { Component } from '@angular/core';
import { DashboardNavigation } from './dashboard-navigation/dashboard-navigation';

@Component({
  selector: 'app-blog-dashboard',
  template: ` <main><app-blog-dashboard-navigation /></main> `,
  imports: [DashboardNavigation],
})
export class Dashboard {}

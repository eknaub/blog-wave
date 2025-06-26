import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavigation } from './dashboard-navigation/dashboard-navigation';
import { Stats } from './stats/stats';

@Component({
  selector: 'blog-dashboard',
  template: `
    <blog-dashboard-navigation />
    <router-outlet />
  `,
  imports: [RouterOutlet, DashboardNavigation],
})
export class Dashboard {}

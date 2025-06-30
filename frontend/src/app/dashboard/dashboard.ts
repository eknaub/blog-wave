import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavigation } from './dashboard-navigation/dashboard-navigation';

@Component({
  selector: 'app-blog-dashboard',
  template: `
    <app-blog-dashboard-navigation />
    <router-outlet />
  `,
  imports: [RouterOutlet, DashboardNavigation],
})
export class Dashboard {}

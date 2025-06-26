import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'blog-dashboard-navigation',
  templateUrl: './dashboard-navigation.html',
  styleUrl: './dashboard-navigation.css',
  imports: [RouterLink],
})
export class DashboardNavigation {}

import { Component } from '@angular/core';
import { Stats } from '../stats/stats';

@Component({
  selector: 'app-dashboard-main',
  imports: [Stats],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboardMain {}

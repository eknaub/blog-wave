import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';

@Component({
  selector: 'app-blog-dashboard-navigation',
  templateUrl: './dashboard-navigation.html',
  styleUrl: './dashboard-navigation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatNavList,
    RouterOutlet,
    MatDividerModule,
    MatButtonModule,
  ],
})
export class DashboardNavigation {
  protected readonly RouteNames = RouteNames;
}

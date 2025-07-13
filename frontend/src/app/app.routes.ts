import { Routes } from '@angular/router';
import { RouteNames } from './shared/interfaces/routes';
import { AuthGuard } from './core/auth-guard';
import { Home } from './home/home';
import { NotFound } from './components/not-found/not-found';
import { GuestGuard } from './core/guest-guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home,
  },
  {
    path: RouteNames.LOGIN,
    title: 'Login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
    canActivate: [GuestGuard],
  },
  {
    path: RouteNames.REGISTER,
    title: 'Register',
    loadComponent: () =>
      import('./auth/register/register').then((m) => m.Register),
    canActivate: [GuestGuard],
  },
  {
    path: RouteNames.PROFILE,
    title: 'Profile',
    loadComponent: () =>
      import('./user-menu/profile/profile').then((m) => m.Profile),
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.SETTINGS,
    title: 'Settings',
    loadComponent: () =>
      import('./user-menu/settings/settings').then((m) => m.Settings),
  },
  {
    path: RouteNames.DASHBOARD,
    title: 'Dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
    canActivateChild: [AuthGuard],
    children: [
      {
        path: RouteNames.HOME,
        loadComponent: () =>
          import('./dashboard/features/stats/stats').then((m) => m.Stats),
      },
      {
        path: RouteNames.USERS,
        title: 'Authors',
        loadComponent: () =>
          import('./dashboard/features/users/users').then((m) => m.Users),
      },
      {
        path: RouteNames.BLOG,
        title: 'Blog',
        loadComponent: () =>
          import('./dashboard/features/blog/blog').then((m) => m.Blog),
      },
    ],
  },
  {
    path: '**',
    title: 'Oops! Page not found',
    component: NotFound,
  },
];

import { Routes } from '@angular/router';
import { RouteNames } from './shared/interfaces/routes';
import { AuthGuard } from './core/auth-guard';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
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
    path: RouteNames.BLOG,
    title: 'Blog',
    loadComponent: () =>
      import('./blog-home/blog-home').then((m) => m.BlogHome),
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
        path: RouteNames.USER_PROFILE + '/:id',
        title: 'User Profile',
        loadComponent: () =>
          import('./dashboard/features/user-profile/user-profile').then(
            (m) => m.UserProfile
          ),
      },
      {
        path: RouteNames.CATEGORY,
        title: 'Category',
        loadComponent: () =>
          import('./dashboard/features/categories/categories').then(
            (m) => m.Categories
          ),
        children: [
          {
            path: 'new',
            title: 'New Category',
            loadComponent: () =>
              import(
                './dashboard/features/categories/category-details/category-details'
              ).then((m) => m.CategoryDetails),
          },
          {
            path: ':id',
            title: 'Category Details',
            loadComponent: () =>
              import(
                './dashboard/features/categories/category-details/category-details'
              ).then((m) => m.CategoryDetails),
          },
        ],
      },
      {
        path: RouteNames.TAGS,
        title: 'Tags',
        loadComponent: () =>
          import('./dashboard/features/tags/tags').then((m) => m.Tags),

        children: [
          {
            path: 'new',
            title: 'New Tag',
            loadComponent: () =>
              import('./dashboard/features/tags/tag-details/tag-details').then(
                (m) => m.TagDetails
              ),
          },
          {
            path: ':id',
            title: 'Tag Details',
            loadComponent: () =>
              import('./dashboard/features/tags/tag-details/tag-details').then(
                (m) => m.TagDetails
              ),
          },
        ],
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

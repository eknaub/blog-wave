import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './dashboard/features/users/users';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Stats } from './dashboard/features/stats/stats';
import { Blog } from './dashboard/features/blog/blog';
import { Settings } from './user-menu/settings/settings';
import { Profile } from './user-menu/profile/profile';
import { RouteNames } from './shared/interfaces/routes';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home,
  },
  {
    path: RouteNames.LOGIN,
    title: 'Login',
    component: Login,
  },
  {
    path: RouteNames.REGISTER,
    title: 'Register',
    component: Register,
  },
  {
    path: RouteNames.PROFILE,
    title: 'Profile',
    component: Profile,
  },
  {
    path: RouteNames.SETTINGS,
    title: 'Settings',
    component: Settings,
  },
  {
    path: RouteNames.DASHBOARD,
    title: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: RouteNames.HOME,
        component: Stats,
      },
      {
        path: RouteNames.USERS,
        title: 'Authors',
        component: Users,
      },
      {
        path: RouteNames.BLOG,
        title: 'Blog',
        component: Blog,
      },
    ],
  },
];

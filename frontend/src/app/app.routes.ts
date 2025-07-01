import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './dashboard/features/users/users';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Stats } from './dashboard/features/stats/stats';
import { Blog } from './dashboard/features/blog/blog';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home,
  },
  {
    path: 'login',
    title: 'Login',
    component: Login,
  },
  {
    path: 'register',
    title: 'Register',
    component: Register,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        component: Stats,
      },
      {
        path: 'users',
        title: 'Authors',
        component: Users,
      },
      {
        path: 'blog',
        title: 'Blog',
        component: Blog,
      },
    ],
  },
];

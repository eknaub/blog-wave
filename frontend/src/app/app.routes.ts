import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './dashboard/users/users';
import { Blog } from './dashboard/blog/blog';
import { DashboardMain } from './dashboard/dashboard-main/dashboard-main';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';

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
        component: DashboardMain,
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

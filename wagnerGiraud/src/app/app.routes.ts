import { Routes } from '@angular/router';
import { authGuard } from './core/application/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome'
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/public/welcome/welcome.component').then((module) => module.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((module) => module.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then((module) => module.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];

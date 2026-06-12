import type { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import type { LayoutConfig } from './core/services/layout.service';
import { loginGuard } from './core/auth/login.guard';

const layout = (config: Partial<LayoutConfig>) => ({ layout: config });

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./layouts/landing-layout/landing-layout.component').then(c => c.LandingLayout),
    loadChildren: () => import('./features/landing/landing.routes').then(c => c.LANDING_ROUTES),
  },

  // Auth
  {
    path: 'login',
    title: 'Sign in',
    canActivate: [loginGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/login.routes').then(c => c.AUTH_ROUTES),
  },
  // private
  {
    path: 'app',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
      },
      {
        path: 'warehouse-3d',
        data: layout({ topbarTransparent: true, sidebarCollapsed: true }),
        loadComponent: () => import('./features/warehouse-3d/warehouse-3d.component').then(m => m.Warehouse3dComponent),
      },
      {
        path: 'integrations-list',
        loadChildren: () => import('./features/integrations/integrations.routes').then(r => r.INTEGRATIONS_ROUTES),
      },
      {
        path: 'users',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/users/users.component').then(c => c.UsersComponent),
      },
      {
        path: 'plans',
        loadChildren: () => import('./features/plans/plans.routes').then(c => c.PLANS_ROUTES),
      },
      {
        path: 'template',
        loadComponent: () => import('./features/template/template.component').then(c => c.TemplateComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('./layouts/landing-layout/landing-layout.component').then(c => c.LandingLayout),
    loadChildren: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent),
  },
];

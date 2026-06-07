import type { Routes } from '@angular/router';

export const PLANS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./plans.component').then(m => m.PlansComponent),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () => import('./plans-list/plans-list.component').then(m => m.PlansListComponent),
      },
      {
        path: 'archive',
        loadComponent: () => import('./plans-archive/plans-archive.component').then(m => m.PlansAcrhiveComponent),
      },
    ],
  },
];

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
        path: 'selection',
        loadComponent: () => import('./plan-selection/plan-selection.component').then(m => m.PlanSelectionComponent),
      },
      {
        path: 'configurator',
        loadComponent: () => import('./configurator/configurator.component').then(m => m.PlanConfiguratorComponent),
      },
    ],
  },
];

import type { NavEntry } from './sidebar.types';

export const NAV_CONFIG: NavEntry[] = [
  {
    type: 'item',
    label: 'Home',
    route: '/app/dashboard',
    icon: 'Shop_light',
  },
  {
    type: 'item',
    label: 'Warehouse 3D',
    route: '/app/warehouse-3d',
    icon: 'Map_light',
  },

  // ── Admin section ──────────────────────────────
  {
    type: 'divider',
    label: 'Control',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Plans and prices',
    route: '/app/plans',
    icon: 'Molecule_light',
    roles: ['ADMIN'],
    children: [
      { label: 'Список планів', route: '/app/plans/list' },
      { label: 'Архів', route: '/app/plans/archive' },
    ],
  },
  {
    type: 'item',
    label: 'Plan configurator',
    route: '/app/plans',
    icon: 'Setting_line_light',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Integrations & Groups',
    route: '/app/integrations-list',
    icon: 'Chemistry _light',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Users',
    route: '/app/users',
    icon: 'Group_add_light',
    roles: ['ADMIN'],
  },

  // ── Shared section ────────────────────────────
  // {
  //   type: 'divider',
  //   label: 'Tools',
  // },
  // {
  //   type: 'item',
  //   label: 'Picking IA',
  //   route: '/app/picking-ia',
  //   icon: 'Return',
  //   roles: ['ADMIN'],
  // },
];

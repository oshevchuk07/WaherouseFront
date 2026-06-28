import type { NavEntry } from './sidebar.types';

// {
//   type: 'divider',
//   label: 'Control',
//   roles: ['ADMIN'],
// },
//  {
//     type: 'item',
//     label: 'Plans and prices',
//     route: '/app/plans/selection',
//     icon: 'Molecule_light',
//     roles: ['ADMIN'],
// children: [
//   { label: 'Plan list', route: '/app/plans/list' },
//   { label: 'Archive', route: '/app/plans/archive' },
// ],
// },

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
    type: 'item',
    label: 'Plan & subscriptions',
    route: '/app/plans/selection',
    icon: 'Molecule_light',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Plan configurator',
    route: '/app/plans/configurator',
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
];

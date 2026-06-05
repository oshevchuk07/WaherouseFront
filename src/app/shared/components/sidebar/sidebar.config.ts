import { NavEntry } from './sidebar.types';

export const NAV_CONFIG: NavEntry[] = [
  {
    type: 'item',
    label: 'Home',
    route: '/app/dashboard',
    icon: 'Map_light',
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
    label: 'Управління',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Planes y precios',
    route: '/app/plans',
    icon: 'Return',
    roles: ['ADMIN'],
    children: [
      { label: 'Список планів', route: '/app/plans/list' },
      { label: 'Архів', route: '/app/plans/archive' },
    ],
  },
  {
    type: 'item',
    label: 'Configurador',
    route: '/app/tariff-configurator',
    icon: 'Return',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Servicios y grupos',
    route: '/app/services-groups',
    icon: 'Return',
    roles: ['ADMIN'],
  },
  {
    type: 'item',
    label: 'Usuarios',
    route: '/app/users',
    icon: 'Return',
    roles: ['ADMIN'],
  },

  // ── Shared section ────────────────────────────
  {
    type: 'divider',
    label: 'Інструменти',
  },
  {
    type: 'item',
    label: 'Picking IA',
    route: '/app/picking-ia',
    icon: 'Return',
    roles: ['ADMIN'],
  },
];
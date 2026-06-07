import type { UserRole } from '../../../core/models/user.model';

export interface NavItem {
  type: 'item';
  label: string;
  route: string;
  icon: string;
  roles?: UserRole[];
  children?: NavChildItem[];
}

export interface NavDivider {
  type: 'divider';
  label?: string;
  roles?: UserRole[];
}

export type NavEntry = NavItem | NavDivider;

export interface NavChildItem {
  label: string;
  route: string;
}

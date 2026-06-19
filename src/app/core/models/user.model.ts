import type { PlanItemModel } from '../../features/plans/plan.models';

export type UserRole = 'ADMIN' | 'USER';
export enum PaymentType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  avatar: string | null;
  role: UserRole;
  paymentType: PaymentType;
  planId: number | null;
  plan: PlanItemModel | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  paymentType: PaymentType;
  role: UserRole;
}

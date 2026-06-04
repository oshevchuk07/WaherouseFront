export type UserRole = "ADMIN" | "USER";
export type PaymentType = "MONTHLY" | "YEARLY";

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
  plan: Plan | null;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string | null;
  subtitle: string | null;
  isActive: boolean;
  isPopular: boolean;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  prevMonthlyPrice: number | null;
  prevYearlyPrice: number | null;
  advantages: unknown;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  paymentType: PaymentType;
  role: UserRole;
}
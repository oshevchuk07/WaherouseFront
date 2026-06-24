import type { IntegrationItemModel } from '../integrations/integrations.model';

export type IntegrationItemWithoutGroup = Omit<IntegrationItemModel, 'groupId'>;

export interface PlanItemModel {
  id: number;
  name: string;
  description: string | null;
  subtitle: string | null;

  isActive: boolean;
  isPopular: boolean;

  monthlyPrice: number | null;
  yearlyPrice: number | null;
  oldMonthlyPrice: number | null;
  oldYearlyPrice: number | null;

  features: Record<string, IntegrationItemWithoutGroup[]>;

  createdAt: string;
  updatedAt: string;
}

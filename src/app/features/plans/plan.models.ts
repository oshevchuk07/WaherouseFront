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
  advantages: unknown;
}

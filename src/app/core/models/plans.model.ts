export interface TariffItemModel {
  id: number;
  name: string;
  description: string;
  subtitle: string;

  isActive: boolean;
  isPopular: boolean;

  monthlyPrice: number;
  yearlyPrice: number;
  prevMonthlyPrice: number;
  prevYearlyPrice: number;

  advantages?: string;

  planServices: {
    id: number;
    planId: number;
    serviceId: number;
  }[];

  createdAt: string;
  updatedAt: string;
}

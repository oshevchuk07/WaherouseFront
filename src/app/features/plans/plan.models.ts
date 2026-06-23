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

  planIntegrations: {
    integration: {
      id: number;
      isActive: true;
      logoImage: string;
      name: string;
      url: string;
      group: {
        id: number;
        name: string;
      };
    };
  }[];

  createdAt: string;
  updatedAt: string;
}

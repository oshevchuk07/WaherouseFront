export interface IntegrationGroupModel {
  id: number;
  name: string;
  services: IntegrationItemModel[];
}

export interface IntegrationItemModel {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  isActive: boolean;
  logoImage: string;
  url: string;

  logo: string;
}

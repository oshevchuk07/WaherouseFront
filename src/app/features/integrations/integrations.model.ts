export interface IntegrationGroupModel {
  id: number;
  name: string;
  integrations: IntegrationItemModel[];
}

export interface IntegrationItemModel {
  id: number;
  name: string;
  groupId: number;
  description: string;
  isActive: boolean;
  logoImage: string;
  url: string;
}

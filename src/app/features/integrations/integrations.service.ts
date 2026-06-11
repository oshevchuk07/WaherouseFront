/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environrments/environment';
import type { IntegrationGroupModel, IntegrationItemModel } from './integrations.model';
import type { PaginatedResponse } from '../../core/models/api-response.model';
import { type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  integrations = signal<IntegrationGroupModel[]>([]);
  isIntegrationsLoading = signal(false);

  fetchIntegrations(): void {
    this.isIntegrationsLoading.set(true);
    this.http.get<PaginatedResponse<IntegrationGroupModel>>(`${this.api}/integrations/groups`).subscribe({
      next: res => {
        this.integrations.set(res.data || []);
      },
      error: () => {
        this.integrations.set([]);
      },
      complete: () => {
        this.isIntegrationsLoading.set(false);
      },
    });
  }

  addCategory(params: { name: string }): Observable<IntegrationGroupModel> {
    return this.http.post<IntegrationGroupModel>(`${this.api}/integrations/groups`, params);
  }

  updateCategory(id: number, params: { name: string | null }): Observable<IntegrationGroupModel> {
    return this.http.put<IntegrationGroupModel>(`${this.api}/integrations/groups/${id}`, params);
  }

  addService(params: any): Observable<IntegrationItemModel> {
    return this.http.post<IntegrationItemModel>(`${this.api}/integrations`, params);
  }

  updateService(id: string, params: any): Observable<IntegrationItemModel> {
    return this.http.put<IntegrationItemModel>(`${this.api}/integrations/${id}`, params);
  }

  uploadServiceImage(serviceId: string, formData: any): Observable<IntegrationItemModel> {
    return this.http.post<IntegrationItemModel>(`${this.api}/integrations/${serviceId}/logo`, formData);
  }

  removeServiceImage(serviceId: string | number): Observable<IntegrationItemModel> {
    return this.http.delete<IntegrationItemModel>(`${this.api}/integrations/${serviceId}/logo`);
  }

  bulkReplaceServices(planId: number, integrationIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.api}/plans/${planId}/integrations`, {
      integrationIds,
    });
  }

  getPlanItem(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/plans/${id}`);
  }
}

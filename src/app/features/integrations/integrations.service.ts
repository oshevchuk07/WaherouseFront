/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environrments/environment';
import type { IntegrationGroupModel } from './integrations.model';
import type { ApiResponse } from '../../core/models/api-response.model';
import { map, type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl + '/';

  integrations = signal<IntegrationGroupModel[]>([]);
  isIntegrationsLoading = signal(false);

  fetchIntegrations(): void {
    this.isIntegrationsLoading.set(true);
    this.http.get<ApiResponse<IntegrationGroupModel[]>>(`${this.api}service/category/list`).subscribe({
      next: res => {
        if (res.success) this.integrations.set(res.data || []);
      },
      error: () => {
        this.integrations.set([]);
      },
      complete: () => {
        this.isIntegrationsLoading.set(false);
      },
    });
  }

  // todo: rename
  addCategory(params: any) {
    return this.http.post<ApiResponse<IntegrationGroupModel>>(this.api + 'service/category', params).pipe(map(res => res.data ?? {}));
  }

  // todo: rename
  updateCategory(id: string, params: { name: string | null }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.api + 'service/category/' + id, params).pipe(map(res => res.data ?? []));
  }

  addService(params: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.api + 'service', params);
  }

  updateService(id: string, params: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.api + 'service/' + id, params);
  }

  uploadServiceImage(serviceId: string, formData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.api + 'service/upload-image/' + serviceId, formData);
  }

  removeServiceImage(serviceId: string | number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.api + 'service/delete-image/' + serviceId);
  }

  bulkReplaceServices(planId: number, serviceIds: number[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.api + 'plan/bulk-replace-services', {
      planId: planId,
      serviceIds: serviceIds,
    });
  }

  getPlanItem(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.api + 'plan/' + id);
  }
}

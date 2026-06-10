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
  private readonly api = environment.apiUrl;

  integrations = signal<IntegrationGroupModel[]>([]);
  isIntegrationsLoading = signal(false);

  fetchIntegrations(): void {
    this.isIntegrationsLoading.set(true);
    this.http.get<ApiResponse<IntegrationGroupModel[]>>(`${this.api}/service/category/list`).subscribe({
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

  addCategory(params: any) {
    return this.http.post<ApiResponse<IntegrationGroupModel>>(this.api + 'service/category', params).pipe(map(res => res.data ?? {}));
  }

  updateCategory(id: string, params: { name: string | null }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.api + 'service/category/' + id, params).pipe(map(res => res.data ?? []));
  }
}

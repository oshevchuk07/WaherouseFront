/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environrments/environment';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { PaginatedResponse } from '../../core/models/api-response.model';
import type { PlanItemModel } from './plan.models';

// todo add types
@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getAll(): Observable<PlanItemModel[]> {
    return this.http.get<PaginatedResponse<PlanItemModel>>(`${this.api}/plans`).pipe(map(res => res.data ?? []));
  }

  /** Returns only active plans, sorted by monthly price ascending. */
  getActivePlans(): Observable<PlanItemModel[]> {
    return this.getAll().pipe(map(plans => plans.filter(p => p.isActive).sort((a, b) => (a.monthlyPrice ?? 0) - (b.monthlyPrice ?? 0))));
  }

  addPlanItem(params: Partial<PlanItemModel>): Observable<any> {
    return this.http.post(this.api + '/plans', params);
  }

  updateTariffItem(id: string | number, params: Partial<PlanItemModel>): Observable<any> {
    return this.http.put<any>(this.api + '/plans/' + id, params);
  }
  removeTariff(id: string): Observable<any> {
    return this.http.delete<any>(this.api + '/plans/' + id);
  }

  startPlan(userId: string, planId: any, paymentType: any): Observable<any> {
    return this.http.put<any>(this.api + '/users/' + userId + '/assign-plan', {
      planId: planId,
      paymentType: paymentType,
    });
  }
}

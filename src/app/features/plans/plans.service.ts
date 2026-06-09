import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environrments/environment';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { ApiResponse } from '../../core/models/api-response.model';
import type { Plan } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getAll(): Observable<Plan[]> {
    return this.http.get<ApiResponse<Plan[]>>(`${this.api}/plan/list`).pipe(map(res => res.data ?? []));
  }

  /** Returns only active plans, sorted by monthly price ascending. */
  getActivePlans(): Observable<Plan[]> {
    return this.getAll().pipe(map(plans => plans.filter(p => p.isActive).sort((a, b) => (a.monthlyPrice ?? 0) - (b.monthlyPrice ?? 0))));
  }
}

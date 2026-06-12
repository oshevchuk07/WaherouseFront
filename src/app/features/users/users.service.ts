import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { User } from '../../core/models/user.model';
import type { PaginatedResponse } from '../../core/models/api-response.model';
import { environment } from '../../../environrments/environment';

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  planId?: number;
  isActive?: boolean;
  role?: string;
  paymentType?: string;
}

export interface AssignPlanPayload {
  planId: number;
  paymentType?: 'MONTHLY' | 'YEARLY';
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getAll(): Observable<User[]> {
    return this.http.get<PaginatedResponse<User>>(`${this.api}/users`).pipe(map(res => res.data ?? []));
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`);
  }

  update(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/users/${id}`);
  }

  assignPlan(id: number, payload: AssignPlanPayload): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${id}/plan`, payload);
  }

  removePlan(id: number): Observable<User> {
    return this.http.delete<User>(`${this.api}/users/${id}/plan`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../core/models/user.model';
import { ApiResponse } from '../../core/models/api-response.model';
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
    return this.http
      .get<ApiResponse<User[]>>(`${this.api}/users/list`)
      .pipe(map(res => res.data ?? []));
  }

  getById(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.api}/users/${id}`)
      .pipe(map(res => res.data!));
  }

  update(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.api}/users/${id}`, payload)
      .pipe(map(res => res.data!));
  }

  remove(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.api}/users/${id}`)
      .pipe(map(() => undefined));
  }

  assignPlan(id: number, payload: AssignPlanPayload): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.api}/users/${id}/assign-plan`, payload)
      .pipe(map(res => res.data!));
  }

  removePlan(id: number): Observable<User> {
    return this.http
      .delete<ApiResponse<User>>(`${this.api}/users/${id}/plan`)
      .pipe(map(res => res.data!));
  }
}
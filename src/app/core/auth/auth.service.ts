import { inject, Injectable } from '@angular/core';
import type { AuthUser } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environrments/environment';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { ApiResponse } from '../models/api-response.model';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  access_token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly api = environment.apiUrl;

  login(payload: LoginPayload): Observable<LoginData> {
    return this.http.post<ApiResponse<LoginData>>(`${this.api}/auth/login`, payload).pipe(map(res => res.data!));
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.api}/auth/profile`).pipe(map(res => res.data!));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

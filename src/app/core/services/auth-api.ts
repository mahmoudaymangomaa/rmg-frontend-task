import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

import { AuthUser } from '../../shared/models/auth-user';

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post(`${this.API_URL}/login`, { email, password })
      .pipe(
        switchMap(() =>
          this.http.get<AuthUser[]>(`${this.API_URL}/users`)
        ),
        map(users => {
          const user = users.find(
            u => u.email === email && (u as any).password === password
          );

          if (!user) {
            throw new HttpErrorResponse({ status: 401 });
          }

          return {
            token: 'fake-jwt-token',
            user,
          };
        })
      );
  }
}

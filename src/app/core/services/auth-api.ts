import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

import { AuthUser } from '../../shared/models/auth-user';
import { AppConfigService } from '../config/app-config.service';

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .get<{ users: AuthUser[] }>(`${this.appConfig.baseURL}users.json`)
      .pipe(
        map(response => {
          const users = response.users;

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

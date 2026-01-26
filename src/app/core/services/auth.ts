import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage';
import { AuthUser } from '../../shared/models/auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // ============================
  // DEPENDENCIES
  // ============================
  private readonly localStorage = inject(LocalStorageService);

  // ============================
  // CONSTANTS
  // ============================
  private readonly TOKEN_KEY = 'token';

  // ============================
  // TOKEN STATE
  // ============================
  private tokenSignal = signal<string | null>(this.getToken());

  private getToken(): string | null {
    return this.localStorage.get<string>(this.TOKEN_KEY);
  }

  token = computed(() => this.tokenSignal());

  setToken(token: string): void {
    if (!token) return;

    this.localStorage.set(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  removeToken(): void {
    this.localStorage.remove(this.TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  // ============================
  // USER STATE
  // ============================
  private userSignal = signal<AuthUser | null>(null);

  user = computed(() => this.userSignal());

  setUser(user: AuthUser): void {
    this.userSignal.set(user);
  }

  // ============================
  // AUTH STATUS
  // ============================
  isAuthenticated = computed(() => !!this.tokenSignal());

  // ============================
  // LOGOUT
  // ============================
  logout(): void {
    this.removeToken();
    this.userSignal.set(null);
  }
}

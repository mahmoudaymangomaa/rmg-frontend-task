import { Injectable, computed, signal } from '@angular/core';
import { AuthUser } from '../../shared/models/auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'rmg_auth_token';
  private readonly USER_KEY = 'rmg_auth_user';
  private readonly REMEMBER_KEY = 'rmg_remember_me';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<AuthUser | null>(this.getStoredUser());

  token = computed(() => this.tokenSignal());
  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());

  private getStoredToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): AuthUser | null {
    const user =
      sessionStorage.getItem(this.USER_KEY) ||
      localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setToken(token: string): void {
    const storage = this.shouldRemember() ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  setUser(user: AuthUser): void {
    const storage = this.shouldRemember() ? localStorage : sessionStorage;
    storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  setRememberMe(remember: boolean): void {
    remember
      ? localStorage.setItem(this.REMEMBER_KEY, 'true')
      : localStorage.removeItem(this.REMEMBER_KEY);
  }

  private shouldRemember(): boolean {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }
}

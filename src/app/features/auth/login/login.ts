import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth';
import { AuthApiService, LoginResponse } from '../../../core/services/auth-api';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isEmailValid = computed(() =>
    this.EMAIL_REGEX.test(this.email())
  );

  showEmailError = computed(() =>
    !!this.email() && !this.isEmailValid()
  );

  showPasswordHint = computed(() =>
    this.password().length > 0 && this.password().length < 6
  );

  isFormValid = computed(() =>
    this.isEmailValid() && this.password().length >= 6
  );

  onEmailChange(value: string): void {
    this.email.set(value);
    this.clearError();
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.clearError();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onRememberMeChange(checked: boolean): void {
    this.rememberMe.set(checked);
  }
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  submit(): void {
    if (!this.isFormValid() || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    this.authApi
      .login(this.email(), this.password())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.handleLoginError(error);
          this.loading.set(false);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.onLoginSuccess(response);
        },
        complete: () => this.loading.set(false),
      });
  }

  private onLoginSuccess(response: LoginResponse): void {
    this.authService.setRememberMe(this.rememberMe());
    this.authService.setToken(response.token);
    this.authService.setUser(response.user);
    this.router.navigate(['/']);
  }

  private handleLoginError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.error.set('Invalid email or password');
    } else if (error.status === 0) {
      this.error.set('Network error');
    } else {
      this.error.set('Unexpected error occurred');
    }
  }

  private clearError(): void {
    if (this.error()) this.error.set(null);
  }

  navigateToSignup(): void {
    this.router.navigateByUrl('/auth/signup');
  }

  navigateToForgotPassword(): void {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}

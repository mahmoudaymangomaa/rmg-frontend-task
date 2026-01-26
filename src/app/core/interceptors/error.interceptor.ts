import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const router = inject(Router);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Check for application-specific errors in headers
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(() => new Error(applicationError));
          }

          // Handle unauthorized and forbidden errors
          if (error.status === 401 || error.status === 403) {
            router.navigateByUrl('/login');
            return throwError(() => new Error('UnauthorizedError'));
          }

          // Handle client-side or network errors
          const errors = error.error?.errors;
          const message = error.error?.message || 'An error occurred';

          // Log the detailed error for debugging
          console.error('Error details:', error);

          // Return a formatted error object
          return throwError(() => ({
            code: error.status,
            errors: errors && errors.length > 0 ? errors : [message],
          }));
        }

        // Handle unexpected errors
        return throwError(() => new Error('UnknownError'));
      })
    );
  }


}

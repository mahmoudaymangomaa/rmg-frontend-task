import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 🚫 Skip fake json-server requests
  if (req.url.startsWith('http://localhost:3000')) {
    return next(req);
  }

  const token = localStorage.getItem('rmg_auth_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};

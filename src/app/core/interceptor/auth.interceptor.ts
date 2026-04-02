import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {LocalStorageService} from '../services/local-storage.service';
import {catchError, from, switchMap, throwError} from 'rxjs';
import {readonly} from '@angular/forms/signals';
import {AuthStore} from '../auth/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(LocalStorageService);
  const authStore = inject(AuthStore);
  const token = storage.getItem<string>('accessToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403 && !req.url.includes('/api/auth/login')) {
        return from(authStore.refreshTokens()).pipe(
          switchMap(newToken => {
            if (newToken) {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              console.log(newToken);
              return next(retryReq);
            }
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

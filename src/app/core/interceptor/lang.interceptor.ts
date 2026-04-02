import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const transloco = inject(TranslocoService);
  const lang = transloco.getActiveLang();

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': lang
    }
  });

  return next(modifiedReq);
};

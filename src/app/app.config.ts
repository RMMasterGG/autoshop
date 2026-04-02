import {ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {provideTransloco} from '@jsverse/transloco';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {langInterceptor} from './core/interceptor/lang.interceptor';
import {authInterceptor} from './core/interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([langInterceptor, authInterceptor])
    ),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideBrowserGlobalErrorListeners(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ru'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideRouter(routes)
  ]
};

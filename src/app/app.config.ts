import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from '@core/http/base-url-interceptor';
import { authInterceptor } from '@core/http/auth-interceptor';
import { refreshInterceptor } from '@core/http/refresh-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, authInterceptor, refreshInterceptor])),
    provideRouter(routes)
  ]
};

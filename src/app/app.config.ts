import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from '@core/http/base-url-interceptor';
import { authInterceptor } from '@core/http/auth-interceptor';
import { refreshInterceptor } from '@core/http/refresh-interceptor';
import { AppErrorHandler } from '@core/errors/error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, authInterceptor, refreshInterceptor])),
    provideRouter(routes),
    {provide: ErrorHandler, useClass: AppErrorHandler},
  ]
};

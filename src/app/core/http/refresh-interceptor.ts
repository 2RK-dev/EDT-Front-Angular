import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn, } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';
import { isPublicUrl } from '@core/http/utils';
import { RefreshCoordinator } from '@core/http/refresh.coordinator';
import { SessionStore } from '@core/session/session.store';

import { AuthResponse } from '@core/session/auth.dto';

/**
 * Marks internal calls (like /auth/refresh) so the interceptor won't try to refresh again.
 */
const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

function shouldAttemptRefresh (reqUrl: string, err: HttpErrorResponse): boolean {
  if (err.status !== 401) return false;
  return !isPublicUrl(reqUrl);
}

function getOrStartRefresh$ (http: HttpClient, coordinator: RefreshCoordinator, sessionStore: SessionStore): Observable<unknown> {
  if (coordinator.inFlightRefresh$) return coordinator.inFlightRefresh$;

  const refreshWithContext$ = http.post('/auth/refresh', null, {
    context: new HttpContext().set(SKIP_REFRESH, true),
  });

  coordinator.inFlightRefresh$ = refreshWithContext$.pipe(
    catchError((e: unknown) => {
      if (e instanceof HttpErrorResponse && e.status === 401) {
        sessionStore.clearSession();
      }
      return throwError(() => e);
    }),
    finalize(() => {
      coordinator.inFlightRefresh$ = null;
    }),
    shareReplay({bufferSize: 1, refCount: false}),
  );

  return coordinator.inFlightRefresh$;
}

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_REFRESH)) return next(req);

  const http = inject(HttpClient);
  const coordinator = inject(RefreshCoordinator);
  const sessionStore = inject(SessionStore);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);
      if (!shouldAttemptRefresh(req.url, err)) return throwError(() => err);
      return getOrStartRefresh$(http, coordinator, sessionStore).pipe(
        switchMap((value) => {
          sessionStore.setUserAndAccessToken(value as AuthResponse)
          return next(req);
        }),
      );
    }),
  );
};

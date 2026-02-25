import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '@core/session/session.store';
import { environment } from '@environment';
import { isPublicUrl } from '@core/http/utils';

function isOurApi (url: string): boolean {
  const apiBase = new URL(environment.apiBaseUrl);
  const target = new URL(url, window.location.origin);

  if (target.origin !== apiBase.origin) return false;

  const basePath = apiBase.pathname.replace(/\/$/, '') || '/';
  const targetPath = target.pathname.replace(/\/$/, '') || '/';

  return targetPath === basePath || targetPath.startsWith(basePath + '/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isOurApi(req.url)) return next(req);
  req = req.clone({withCredentials: true});
  const accessToken = inject(SessionStore).accessToken();
  if (!accessToken || isPublicUrl(req.url)) return next(req);
  return next(req.clone({
    headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
  }));
};

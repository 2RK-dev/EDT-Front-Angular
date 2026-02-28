import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//.test(req.url)) return next(req);
  const url = req.url.startsWith('/') ? req.url : `/${req.url}`;
  let baseUrl = environment.apiBaseUrl;
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  return next(req.clone({url: `${baseUrl}${url}`}));
};

// noinspection ES6RedundantAwait

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { refreshInterceptor } from './refresh-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { MOCK_AUTH_RESPONSE } from '@core/session/auth.api.mock';
import { expect } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import { RefreshCoordinator } from '@core/http/refresh.coordinator';
import { AuthApi } from '@core/session/auth.api';
import { SessionStore } from '@core/session/session.store';


describe('refreshInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => refreshInterceptor(req, next));
  let mockServer: HttpTestingController;
  let http: HttpClient;
  let sessionStore: SessionStore;

  const flush401 = (req: string) => {
    mockServer.expectOne(req).flush(null, {
      status: 401,
      statusText: "Unauthorized",
      headers: {'WWW-Authenticate': 'Bearer'}
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([refreshInterceptor])),
        provideHttpClientTesting(),
        RefreshCoordinator,
        {provide: AuthApi, useValue: {}},
      ],
    });
    mockServer = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    sessionStore = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    mockServer.verify();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call refresh then retry the original request if refresh succeeds', async () => {
    const envoiPromise = firstValueFrom(http.get('/api/envoi'));
    flush401("/api/envoi");
    mockServer.expectOne('/auth/refresh').flush(MOCK_AUTH_RESPONSE);
    expect(sessionStore.isAuthenticated()).toBeTruthy();
    mockServer.expectOne('/api/envoi').flush({success: true});
    await expect(envoiPromise).resolves.toEqual({success: true});
  });

  it.each(["/auth/login", "/auth/refresh", "/auth/logout"])('should not refresh on public URL %s', async (url) => {
    const p = firstValueFrom(http.get(url));
    flush401(url);
    await Promise.resolve();
    mockServer.expectNone('/auth/refresh');
    await expect(p).rejects.toThrow();
  });

  it('should only allow one in-flight refresh request', async () => {
    const p1 = firstValueFrom(http.get('/api/envoi'));
    flush401('/api/envoi');
    const p2 = firstValueFrom(http.get('/api/reception'));
    flush401('/api/reception');
    mockServer.expectOne('/auth/refresh').flush(MOCK_AUTH_RESPONSE);
    expect(sessionStore.isAuthenticated()).toBeTruthy();
    mockServer.expectOne('/api/envoi').flush({success: true});
    mockServer.expectOne('/api/reception').flush({success: true});
    await expect(p1).resolves.toEqual({success: true});
    await expect(p2).resolves.toEqual({success: true});
  });

  it('should clear session on refresh failure', async () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const p = firstValueFrom(http.get('/api/envoi'));
    flush401('/api/envoi');
    mockServer.expectOne('/auth/refresh').flush({code: 'INVALID_SESSION'}, {status: 401, statusText: 'Unauthorized'});
    await expect(p).rejects.toThrow();
    await Promise.resolve();
    expect(sessionStore.isAuthenticated()).toBeFalsy();
  });
});

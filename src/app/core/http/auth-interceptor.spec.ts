import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionStore } from '@core/session/session.store';
import { environment } from "@environment";

describe('auth interceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let token: string | null = "access-token"

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {provide: SessionStore, useValue: {accessToken: () => token}}
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeAll(() => {
    environment.apiBaseUrl = "https://api.example.com/api";
  });

  afterEach(() => {
    httpMock.verify();
    token = "access-token";
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('does not attach auth/cookies to third-party absolute URLs', () => {
    http.get('https://thirdparty.com/data').subscribe();
    const req = httpMock.expectOne('https://thirdparty.com/data');
    expect(req.request.withCredentials).toBeFalsy();
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush({});
  });

  it('attaches withCredentials and Authorization to our API under base path', () => {
    http.get('https://api.example.com/api/resource').subscribe();
    const req = httpMock.expectOne('https://api.example.com/api/resource');
    expect(req.request.withCredentials).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
    req.flush({});
  });

  it('attaches withCredentials but not Authorization for public auth endpoints', () => {
    http.post('https://api.example.com/api/auth/login', {a: 1}).subscribe();
    const req = httpMock.expectOne('https://api.example.com/api/auth/login');
    expect(req.request.withCredentials).toBeTruthy();
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush({});
  });

  it('does not attach Authorization if token is missing but still sends cookies for our API', () => {
    token = null;
    http.get('https://api.example.com/api/resource').subscribe();
    const req = httpMock.expectOne('https://api.example.com/api/resource');
    expect(req.request.withCredentials).toBeTruthy();
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush({});
  });

  it('does not treat /apiary as under base /api (path boundary test)', () => {
    http.get('https://api.example.com/apiary/resource').subscribe();
    const req = httpMock.expectOne('https://api.example.com/apiary/resource');
    expect(req.request.withCredentials).toBeFalsy();
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush({});
  });
});

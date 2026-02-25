import { AuthApi, isLoginErrorCode, LoginErrorCode } from '@core/session/auth.api';
import { catchError, Observable, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiError, mapHttpError } from "@core/errors/api-error";
import { AuthResponse, LoginRequest } from '@core/session/auth.dto';

const LOGIN_URL = '/auth/login';
const LOGOUT_URL = '/auth/logout';

@Injectable()
export class AuthApiHttp extends AuthApi {
  private http = inject(HttpClient);

  override login (request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(LOGIN_URL, request, {withCredentials: true}).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          return throwError(() => mapHttpError<LoginErrorCode>(err, isLoginErrorCode));
        }
        return throwError(() => new ApiError('UNEXPECTED_ERROR', undefined, err));
      })
    );
  }

  override logout (): Observable<void> {
    return this.http.post<void>(LOGOUT_URL, {}, {withCredentials: true});
  }

}

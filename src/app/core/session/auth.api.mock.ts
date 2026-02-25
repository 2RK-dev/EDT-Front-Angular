import { inject, Injectable, InjectionToken } from '@angular/core';
import { AuthApi, LoginErrorCode } from '@core/session/auth.api';
import { MonoTypeOperatorFunction, Observable, of, throwError } from "rxjs";
import { delay, dematerialize, materialize } from 'rxjs/operators';
import { ApiError } from "@core/errors/api-error";
import { AuthResponse, LoginRequest } from "@core/session/auth.dto";

export const MOCK_API_DELAY = new InjectionToken<number>("MOCK_API_DELAY", {
  providedIn: 'root',
  factory: () => 1200,
})

export const MOCK_AUTH_RESPONSE = {
  accessToken: 'fake-access-token',
  expiresIn: 600,
  tokenType: 'Bearer',
  user: {
    displayName: 'User',
    email: 'user@example.com',
    role: 'USER'
  }
};

function optionalDelay<T> (ms: number): MonoTypeOperatorFunction<T> {
  return ms > 0 ? delay(ms) : (source: Observable<T>) => source;
}

@Injectable()
export class AuthApiMock extends AuthApi {
  delay = inject(MOCK_API_DELAY);

  override login (request: LoginRequest): Observable<AuthResponse> {
    if (request.email != "user@example.com") {
      return throwError(() => new ApiError<LoginErrorCode>("AUTH_UNAUTHORIZED")).pipe(
        materialize(),
        optionalDelay(this.delay),
        dematerialize()
      );
    }

    return of<AuthResponse>(MOCK_AUTH_RESPONSE).pipe(
      optionalDelay(this.delay)
    );
  }

  logout (): Observable<void> {
    return of().pipe(optionalDelay(this.delay));
  }
}

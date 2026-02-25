import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest } from '@core/session/auth.dto';

export abstract class AuthApi {
  abstract login (request: LoginRequest): Observable<AuthResponse>;
  abstract logout (): Observable<void>;
}

/**
 * t(errors.login.AUTH_UNAUTHORIZED)
 */
export const LOGIN_ERROR_CODES = [
  'AUTH_UNAUTHORIZED',
] as const;

export type LoginErrorCode = typeof LOGIN_ERROR_CODES[number];

export function isLoginErrorCode (code: string): code is LoginErrorCode {
  return (LOGIN_ERROR_CODES as readonly string[]).includes(code);
}

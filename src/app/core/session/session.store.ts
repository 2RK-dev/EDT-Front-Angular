import { computed, Injectable, signal } from '@angular/core';

import { AuthResponse } from '@core/session/auth.dto';

@Injectable({
  providedIn: "root"
})
export class SessionStore {
  readonly isAuthenticated = computed<boolean>(() => !!this.accessToken());
  private _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();

  clearSession () {
    this._accessToken.set(null);
  }

  setUserAndAccessToken (loginResponse: AuthResponse) {
    this._accessToken.set(loginResponse.accessToken);
  }
}

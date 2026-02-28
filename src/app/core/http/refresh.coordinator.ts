import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

new InjectionToken<() => number>('NOW_FN', {
  providedIn: 'root',
  factory: () => (() => Date.now()),
});

/**
 * Coordinates refresh-token recovery across concurrent 401s.
 * Ensures only one refresh request is "in-flight" at a time (shared Observable).
 */
@Injectable()
export class RefreshCoordinator {
  inFlightRefresh$: Observable<unknown> | null = null;
}

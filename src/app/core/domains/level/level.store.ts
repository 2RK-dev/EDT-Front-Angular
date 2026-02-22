import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Level} from './level.model';

@Injectable({ providedIn: 'root' })
export class LevelStore {

  private readonly _levels = new BehaviorSubject<Level[]>([]);
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  private readonly _error = new BehaviorSubject<string | null>(null);

  readonly levels$ = this._levels.asObservable();
  readonly isLoading$ = this._isLoading.asObservable();
  readonly error$ = this._error.asObservable();

  setLevels(levels: Level[]) {
    this._levels.next(levels);
  }

  addLevel(level: Level) {
    const currentLevels = this._levels.getValue();
    this._levels.next([...currentLevels, level]);
  }

  removeLevel(id: number) {
    const currentLevels = this._levels.getValue();
    this._levels.next(currentLevels.filter(l => l.id !== id));
  }

  setLoading(isLoading: boolean) {
    this._isLoading.next(isLoading);
  }

  setError(error: string | null) {
    this._error.next(error);
  }
}

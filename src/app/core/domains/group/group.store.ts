import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Group} from './group.model';

@Injectable({ providedIn: 'root' })
export class GroupStore {

  private readonly _groups = new BehaviorSubject<Group[]>([]);
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  private readonly _error = new BehaviorSubject<string | null>(null);

  readonly groups$ = this._groups.asObservable();
  readonly isLoading$ = this._isLoading.asObservable();
  readonly error$ = this._error.asObservable();

  setGroups(groups: Group[]) {
    this._groups.next(groups);
  }

  addGroup(group: Group) {
    const currentGroups = this._groups.getValue();
    this._groups.next([...currentGroups, group]);
  }

  removeGroup(id: number) {
    const currentGroups = this._groups.getValue();
    this._groups.next(currentGroups.filter(g => g.id !== id));
  }

  setLoading(isLoading: boolean) {
    this._isLoading.next(isLoading);
  }

  setError(error: string | null) {
    this._error.next(error);
  }
}

import {Injectable} from '@angular/core';
import {GroupApi} from './group.api';
import {GroupStore} from './group.store';
import {Group} from './group.model';
import {catchError, finalize, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  readonly groups$;
  readonly isLoading$
  readonly error$;

  constructor(
    private groupApi: GroupApi,
    private groupStore: GroupStore
  ) {
    this.groups$ = this.groupStore.groups$;
    this.isLoading$ = this.groupStore.isLoading$;
    this.error$ = this.groupStore.error$;
  }

  loadAllGroups(): void {
    this.groupStore.setLoading(true);
    this.groupStore.setError(null);

    this.groupApi.getAllGroups().pipe(
      tap((groups: Group[]) => this.groupStore.setGroups(groups)),
      catchError((error) => {
        this.groupStore.setError('Erreur lors du chargement des groupes');
        return throwError(() => error);
      }),
      finalize(() => this.groupStore.setLoading(false))
    ).subscribe();
  }

  loadGroupsByLevel(levelId: number): void {
    this.groupStore.setLoading(true);
    this.groupStore.setError(null);

    this.groupApi.getGroupsByLevel(levelId).pipe(
      tap((groups: Group[]) => this.groupStore.setGroups(groups)),
      catchError((error) => {
        this.groupStore.setError('Erreur lors du chargement des groupes du niveau');
        return throwError(() => error);
      }),
      finalize(() => this.groupStore.setLoading(false))
    ).subscribe();
  }

  createGroup(newGroup: Partial<Group>): void {
    this.groupStore.setLoading(true);

    this.groupApi.createGroup(newGroup).pipe(
      tap((createdGroup: Group) => {
        this.groupStore.addGroup(createdGroup);
      }),
      catchError((error) => {
        this.groupStore.setError('Erreur lors de la création du groupe');
        return throwError(() => error);
      }),
      finalize(() => this.groupStore.setLoading(false))
    ).subscribe();
  }

  deleteGroup(id: number): void {
    this.groupApi.deleteGroup(id).pipe(
      tap(() => {
        this.groupStore.removeGroup(id);
      }),
      catchError((error) => {
        this.groupStore.setError('Erreur lors de la suppression du groupe');
        return throwError(() => error);
      })
    ).subscribe();
  }
}

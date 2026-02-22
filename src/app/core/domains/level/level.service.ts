import {Injectable} from '@angular/core';
import {LevelApi} from './level.api';
import {LevelStore} from './level.store';
import {Level} from './level.model';
import {catchError, finalize, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  readonly levels$;
  readonly isLoading$;
  readonly error$;

  constructor(
    private levelApi: LevelApi,
    private levelStore: LevelStore
  ) {
    this.levels$ = this.levelStore.levels$;
    this.isLoading$ = this.levelStore.isLoading$;
    this.error$ = this.levelStore.error$;
  }

  loadLevels(): void {
    this.levelStore.setLoading(true);
    this.levelStore.setError(null);

    this.levelApi.getAllLevels().pipe(
      tap((levels: Level[]) => {
        this.levelStore.setLevels(levels);
      }),
      catchError((error) => {
        this.levelStore.setError('Erreur lors du chargement des niveaux');
        return throwError(() => error);
      }),
      finalize(() => {
        this.levelStore.setLoading(false);
      })
    ).subscribe();
  }

  createLevel(newLevel: Partial<Level>): void {
    this.levelStore.setLoading(true);

    this.levelApi.createLevel(newLevel).pipe(
      tap((createdLevel: Level) => {
        this.levelStore.addLevel(createdLevel);
      }),
      catchError((error) => {
        this.levelStore.setError('Erreur lors de la création');
        return throwError(() => error);
      }),
      finalize(() => this.levelStore.setLoading(false))
    ).subscribe();
  }

  deleteLevel(id: number): void {
    this.levelApi.deleteLevel(id).pipe(
      tap(() => {
        this.levelStore.removeLevel(id);
      }),
      catchError((error) => {
        this.levelStore.setError('Erreur lors de la suppression');
        return throwError(() => error);
      })
    ).subscribe();
  }
}

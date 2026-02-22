import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable, of} from 'rxjs';
import {Level} from './level.model';
import {mockLevels} from './level.mock';

@Injectable({ providedIn: 'root' })
export class LevelApi {
  private readonly API_URL = '/levels';
  private readonly USE_MOCK = true; // Mettre à false pour utiliser l'API réelle
  private mockData: Level[] = [...mockLevels];

  constructor(private http: HttpClient) {}

  getAllLevels(): Observable<Level[]> {
    if (this.USE_MOCK) {
      return of(this.mockData).pipe(delay(500));
    }
    return this.http.get<Level[]>(this.API_URL);
  }

  createLevel(level: Partial<Level>): Observable<Level> {
    if (this.USE_MOCK) {
      const newLevel: Level = {
        id: this.mockData.length + 1,
        name: level.name || '',
        abr: level.abr || ''
      };
      this.mockData.push(newLevel);
      return of(newLevel).pipe(delay(300));
    }
    return this.http.post<Level>(this.API_URL, level);
  }

  deleteLevel(id: number): Observable<void> {
    if (this.USE_MOCK) {
      this.mockData = this.mockData.filter(level => level.id !== id);
      return of(void 0).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

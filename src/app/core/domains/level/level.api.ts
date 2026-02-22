import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Level} from './level.model';

@Injectable({ providedIn: 'root' })
export class LevelApi {
  private readonly API_URL = '/levels';

  constructor(private http: HttpClient) {}

  getAllLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.API_URL);
  }

  createLevel(level: Partial<Level>): Observable<Level> {
    return this.http.post<Level>(this.API_URL, level);
  }

  deleteLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Group, GroupPost} from './group.model';

@Injectable({ providedIn: 'root' })
export class GroupApi {

  constructor(private http: HttpClient) {}

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/groups');
  }

  getGroupsByLevel(levelId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`/levels/${levelId}/groups`);
  }

  createGroup(group: GroupPost): Observable<Group> {
    return this.http.post<Group>('/groups', group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`/groups/${id}`);
  }

  updateGroup(id: number, updatedGroup: GroupPost) {
    return this.http.put<Group>(`/groups/${id}`, updatedGroup);
  }
}

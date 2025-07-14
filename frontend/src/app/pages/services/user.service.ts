import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  role$: Observable<string | null>;
  private baseUrl = environment.apiUrl + '/users';
  constructor(private http: HttpClient, private store: Store) {
    this.store.select(selectRole).subscribe((role: any) => this.role$ = role).unsubscribe();
  }
  getUsersPaginated(role: string, currentPage: number, itemsPerPage: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/paginated?page=${currentPage}&limit=${itemsPerPage}&role=${role}`);
  }
  getUsers(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?role=${role}`);
  }
  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/` + id);
  }
  addUser(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/` + id, data);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/` + id);
  }

  getCurrentUser() {
    return this.http.get(`${this.baseUrl}/me`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectRole } from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  role$: Observable<string | null>;
  constructor(private http: HttpClient, private store: Store) {
    this.store.select(selectRole).subscribe((role: any) => this.role$ = role).unsubscribe();
  }
  getUsersPaginated(role: string, currentPage: number, itemsPerPage: number, status: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/users?page=${currentPage}&limit=${itemsPerPage}&status=${status}&role=${role}`);
  }
  getUserById(id: string) {
    return this.http.get('http://localhost:4000/api/users/' + id);
  }
  addUser(data: any) {
    return this.http.post('http://localhost:4000/api/users', data);
  }
  updateUser(id: string, data: any) {
    return this.http.put('http://localhost:4000/api/users/' + id, data);
  }
  deleteUser(id: string) {
    return this.http.delete('http://localhost:4000/api/users/' + id);
  }

}

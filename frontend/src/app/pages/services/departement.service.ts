import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  baseUrl = environment.apiUrl + '/departements';

  constructor(private http: HttpClient) { }
  getDepartementsPaginated(currentPage: number, itemsPerPage: number) {
    return this.http.get<any>(`${this.baseUrl}?page=${currentPage}&limit=${itemsPerPage}`);
  }
  addDepartement(departement: any) {
    return this.http.post<any>(this.baseUrl, departement);
  }
  getDepartement(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  updateDepartement(id: any, departement: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, departement);
  }
  deleteDepartement(id: any) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

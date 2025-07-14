import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private baseUrl = environment.apiUrl + '/skills';
  constructor(private http: HttpClient) { }
  getSkillsPaginated(currentPage: number, itemsPerPage: number) {
    return this.http.get<any>(`${this.baseUrl}/paginated?page=${currentPage}&limit=${itemsPerPage}`);
  }
  getSkills() {
    return this.http.get<any>(this.baseUrl);
  }
  addSkill(skill: any) {
    return this.http.post<any>(this.baseUrl, skill);
  }
  getSkill(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  updateSkill(id: any, skill: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, skill);
  }
  deleteSkill(id: any) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

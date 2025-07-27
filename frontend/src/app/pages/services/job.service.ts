import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private baseUrl = environment.apiUrl + '/jobs';
  constructor(private http: HttpClient) { }
  getJobsPaginated(currentPage: number, itemsPerPage: number) {
    return this.http.get<any>(`${this.baseUrl}/paginated?page=${currentPage}&limit=${itemsPerPage}`);
  }
  getJobs() {
    return this.http.get<any>(this.baseUrl);
  }
  addJob(job: any) {
    return this.http.post<any>(this.baseUrl, job);
  }
  getJob(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  updateJob(id: any, job: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, job);
  }
  deleteJob(id: any) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

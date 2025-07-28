import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private baseUrl = environment.apiUrl + '/trainings';
  constructor(private http: HttpClient) { }
  getTrainingsPaginated(currentPage: number, itemsPerPage: number) {
    return this.http.get<any>(`${this.baseUrl}/paginated?page=${currentPage}&limit=${itemsPerPage}`);
  }
  getTrainings() {
    return this.http.get<any>(this.baseUrl);
  }
  addTraining(job: any) {
    return this.http.post<any>(this.baseUrl, job);
  }
  getTraining(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  updateTraining(id: any, job: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, job);
  }
  deleteTraining(id: any) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

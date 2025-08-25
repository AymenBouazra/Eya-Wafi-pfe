import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
 providedIn: 'root'
})
export class MobilityRequestService {
 private baseUrl = environment.apiUrl + '/mobility-requests';
 constructor(private http: HttpClient) { }

 createMobilityRequest(data: any): any {
  return this.http.post(`${this.baseUrl}`, data);
 }

 getMobilityRequests(): any {
  return this.http.get(`${this.baseUrl}`);
 }

 getMobilityRequestById(id: string): any {
  return this.http.get(`${this.baseUrl}/${id}`);
 }

 updateMobilityRequest(id: string, data: any): any {
  return this.http.put(`${this.baseUrl}/${id}`, data);
 }

 deleteMobilityRequest(id: string): any {
  return this.http.delete(`${this.baseUrl}/${id}`);
 }
}
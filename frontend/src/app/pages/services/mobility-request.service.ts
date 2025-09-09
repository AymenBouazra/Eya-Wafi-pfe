import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
 providedIn: 'root'
})
export class MobilityRequestService {
 private baseUrl = environment.apiUrl + '/mobility';
 constructor(private http: HttpClient) { }

 createMobilityRequest(data: any): any {
  return this.http.post(`${this.baseUrl}`, data);
 }

 getMobilityRequestsByManager(page: number, itemsPerPage: number): any {
  return this.http.get(`${this.baseUrl}/manager?page=${page}&itemsPerPage=${itemsPerPage}`);
 }

 getAllMobilityRequests(page: number, itemsPerPage: number): any {
  return this.http.get(`${this.baseUrl}/all?page=${page}&itemsPerPage=${itemsPerPage}`);
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

 currentManagerApproval(id: string, data: any) {
  return this.http.put(`${this.baseUrl}/${id}/current-manager-approval`, data);
 }

 managerApproval(id: string, data: any) {
  return this.http.put(`${this.baseUrl}/${id}/manager-approval`, data);
 }

 hrApproval(id: string, data: any) {
  return this.http.put(`${this.baseUrl}/${id}/hr-approval`, data);
 }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl + '/dashboard';
  constructor(private http: HttpClient) { }

  getDashboardstats() {
    return this.http.get(`${this.baseUrl}`);
  }
}

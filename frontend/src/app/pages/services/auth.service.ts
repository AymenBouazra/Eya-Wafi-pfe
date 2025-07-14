import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
  updateAndLogin(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/updateAndLogin/` + id, data);
  }
  checkEmail(data: any) {
    return this.http.post(`${this.baseUrl}/user`, data);
  }
  forgotPassword(data: any) {
    return this.http.post(`${this.baseUrl}/forgotPassword`, data);
  }
  resetPassword(token: string, data: any) {
    return this.http.put(`${this.baseUrl}/resetPassword/` + token, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post('http://localhost:4000/api/auth/login', data);
  }
  updateAndLogin(id: string, data: any) {
    return this.http.put('http://localhost:4000/api/auth/updateAndLogin/' + id, data);
  }
  checkEmail(data: any) {
    return this.http.post('http://localhost:4000/api/auth/user', data);
  }
  forgotPassword(data: any) {
    return this.http.post('http://localhost:4000/api/auth/forgotPassword', data);
  }
  resetPassword(token: string, data: any) {
    return this.http.put('http://localhost:4000/api/auth/resetPassword/' + token, data);
  }
}

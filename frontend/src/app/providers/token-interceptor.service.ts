import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const newReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        },
      });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
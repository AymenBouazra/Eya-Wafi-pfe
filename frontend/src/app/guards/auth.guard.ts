import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (token !== null) {
      const expire = this.isExpiredToken(token)
      if (expire) {
        this.router.navigateByUrl('/login');
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  isExpiredToken(token: string): boolean {
    const helper = new JwtHelperService();

    const decoded = helper.decodeToken(token);

    const expireDate = new Date();
    expireDate.setUTCDate(decoded.exp);
    const currentDate = new Date();
    return (expireDate.valueOf() > currentDate.valueOf());
  }


}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  currentRole: string;

  roles: any = {
    leader: "leader",
    customer: "customer",
    worker: "worker"
  };

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    let url: string = router.url;
    return this.checkUserLogin(route, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    const token = localStorage.getItem('JwtToken');
    const tokenInfo = this.getDecodedAccessToken(token);
    this.currentRole = tokenInfo.extension_Role;

    if (token) {
      const role = this.roles[this.currentRole];
      if (route.data['role'] && route.data['role'].indexOf(role) === -1) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}

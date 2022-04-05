import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('JwtToken');
    if (!token) {
      return next.handle(req);
    }
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next.handle(modifiedReq);
  }
}

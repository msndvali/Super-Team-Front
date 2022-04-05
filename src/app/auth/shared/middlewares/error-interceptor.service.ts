import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { B2CService } from '../services/b2c.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  errorMessage = new BehaviorSubject<string | any>(null);

  errorStatus: any = {
    401: 'Unauthorized Error',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Something Went Wrong',
    503: 'Service Unavailable',
    0: 'გელა'
  };

  constructor(public toastService: ToastService, private b2cService: B2CService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if(error.status == 500 && error.message.includes('Http failure response for') && error.error.detail.includes('The primary claims identity and/or claims cannot be found')) {
            errorMsg = 'Connection timed out';
            this.b2cService.logout();
          }
          else if(error.status == 500 && error.message.includes('The specified password does not comply with password complexity')) {
            errorMsg = 'The specified password does not comply with password complexity';
          }
          else if(this.errorStatus[error.status]) {
            errorMsg = this.errorStatus[error.status];
          }
          else {
            errorMsg = 'Error happened while running';
          }

          this.toastService.show(errorMsg, { classname: 'bg-danger text-light', delay: 5000 });
          return throwError(errorMsg);
        })
      )
  }
}

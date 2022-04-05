import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private registeredOrganization = new BehaviorSubject<any>(null);

  organization = this.registeredOrganization.asObservable();

  constructor(private http: HttpClient) { }

  passOrganization(org: object) {
    this.registeredOrganization.next(org);
  }

  createOrganization(organization): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Organization`, organization
    )
  }

}

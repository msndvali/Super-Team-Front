import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TimesheetService {

  constructor(private http: HttpClient) { }

  getProject(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}`
    )
  }

  getTimesheet(timesheet: any): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}TimeSheet/Detailed`, timesheet
    )
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}users`
    )
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FindWorkService {

  constructor(private http: HttpClient) { }

  getProjects(term: string, city: string, startDate: string, number: number, size: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(
      `${environment.ApiUrl}Projects/Filter`,
      {
        term: term,
        city: city,
        startDate: startDate,
        pageNumber: number,
        pageSize: size,
      },
      {headers: headers}
    )
  }
}

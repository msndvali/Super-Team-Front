import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getOrganizationId(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization`,
    )
  }

  getLeaderProjects(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization/${id}/Projects`
    )
  }

  getWorkerProjects(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization/${id}/Worker/Projects`
    )
  }

  getUserProjects(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}User/projects`
    )
  }

}

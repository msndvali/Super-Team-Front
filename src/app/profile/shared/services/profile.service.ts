import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(private http: HttpClient) { }

  getOrganizationId(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization`,
    )
  }

  addImage(formData: FormData): Observable<any> {
    return this.http.post<{ path: string }>(
      `${environment.ApiUrl}File?blobType=image`, formData
    )
  }

  addFile(formData: FormData): Observable<any> {
    return this.http.post<{ path: string }>(
      `${environment.ApiUrl}File?blobType=document`, formData
    )
  }

  updateOrganizarion(upload: any): Observable<any> {
    return this.http.put(
      `${environment.ApiUrl}Organization`, upload
    )
  }
}

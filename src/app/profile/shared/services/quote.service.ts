import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {

  constructor(private http: HttpClient) { }

  getQuote(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Quote?projectId=${id}`
    )
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CalculateService {
  private calculateQuoteForm = new BehaviorSubject<object>({});
  private floorPlan = new BehaviorSubject<object>({});

  calcRoom = this.calculateQuoteForm.asObservable();
  fp = this.floorPlan.asObservable();

  constructor(private http: HttpClient) { }

  passRoom(form: object) {
    this.calculateQuoteForm.next(form);
  }

  passFloorPlan(plan: any) {
    this.floorPlan.next(plan);
  }

  getFurniture(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Furniture`
    )
  }

  getStates(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Location/States`
    )
  }

  getCities(state: any): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Location/States/Cities`,
      {
        stateIds: state
      }
    )
  }

  quoteCalculate(calculate: Object): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Quote/Calculate`, calculate
    )
  }

  property(property: Object): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Property`, property
    )
  }

  createProject(id: number, length: number, start: string, end: string, city: any, quote: any, address: any, needsFurniture: any): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Projects`,
      {
        propertyId: id,
        startingDate: start,
        expectedFinishDate: end,
        projectLength: length,
        address: address,
        cityId: city,
        needsFurniture: needsFurniture,
        quote: quote,
      }
    )
  }

  addFiles(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}File?blobType=floorplan`, formData
    )
  }

  checkJunehomes(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}User/IsJunehomes`
    )
  }
}

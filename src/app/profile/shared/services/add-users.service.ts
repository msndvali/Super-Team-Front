import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersModel } from '../models/add-users.model';

@Injectable({ providedIn: 'root' })
export class AddUsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}users`
    )
  }

  addUsers(userForm: any): Observable<any> {
    return this.http.post(
     `${environment.ApiUrl}User`, userForm
    )
  }

  updateUsers(userForm: any): Observable<any> {
    return this.http.put(
     `${environment.ApiUrl}User`, userForm
    )
  }

  deleteUsers(id: any): Observable<any> {
    return this.http.delete(
      `${environment.ApiUrl}User/${id}?userId=${id}`
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
}

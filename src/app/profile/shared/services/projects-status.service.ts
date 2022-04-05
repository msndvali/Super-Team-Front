import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExpensesModel } from '../models/expenses.model';
import { WorkHoursModel } from '../models/work-hours.model';

@Injectable({ providedIn: 'root' })
export class ProjectsStatusService {

  constructor(private http: HttpClient) { }

  changeProjectStatus(status: any): Observable<any> {
    return this.http.post(
      'url',
      {
        status
      }
    )
  }

  getProject(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}`
    )
  }

  getOrganizationId(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Organization`,
    )
  }

  AddWorkHoursUsers(workerId: any, fullname: string, projectId: number): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}TimeSheet/Worker/${workerId}`,
      {
        projectId: projectId,
        workerName: fullname
      }
    )
  }

  getTimesheet(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}/Timesheet`
    )
  }

  addWorkHours(hour, start, end, categoryId, userId, fullName, id): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}TimeSheet/WorkHours`,
      {
        start: start,
        end: end,
        hours: hour,
        projectId: id,
        categoryId: categoryId,
        workerId: userId,
        workerName: fullName
      }
    )
  }

  updateWorkHours(hour, start, end, id): Observable<any> {
    return this.http.put(
      `${environment.ApiUrl}TimeSheet/WorkHours`,
      {
        id: id,
        start: start,
        end: end,
        hours: hour
      }
    )
  }

  deleteWorkHours(id): Observable<any> {
    return this.http.delete(
      `${environment.ApiUrl}TimeSheet/WorkHours/${id}`
    )
  }

  getExpenses(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Projects/${id}/Expenses`
    )
  }

  getExpenseTypes(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}Expense/types`
    )
  }

  addExpenses(category, cost, date, userId, fullName, id, fileName): Observable<any> {
    return this.http.post(
      `${environment.ApiUrl}Expense`,
      {
        cost: cost,
        expenseTypeId: category,
        projectId: id,
        receiptHolderId: userId,
        receiptHolderName: fullName,
        date: date,
        checkUrl: fileName
      }
    )
  }

  updateExpenses(category, cost, date, userId, fullName, id, fileName): Observable<any> {
    return this.http.put(
      `${environment.ApiUrl}Expense`,
      {
        id: id,
        cost: cost,
        expenseTypeId: category,
        receiptHolderId: userId,
        receiptHolderName: fullName,
        date: date,
        checkUrl: fileName
      }
    )
  }

  deleteExpenses(id): Observable<any> {
    return this.http.delete(
      `${environment.ApiUrl}Expense/${id}`
    )
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(
      `${environment.ApiUrl}users`
    )
  }

  addFiles(formData: FormData, source: string): Observable<any> {
    return this.http.post<any>(
      `${environment.ApiUrl}File?blobType=${source}`, formData
    )
  }

  updateproject(upload: any): Observable<any> {
    return this.http.put<any>(
      `${environment.ApiUrl}Projects`, upload
    )
  }

}

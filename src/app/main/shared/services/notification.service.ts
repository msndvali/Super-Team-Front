import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    constructor(private http: HttpClient) { }

    getNumUnreadNotifications(): Observable<any> {
        return this.http.get<any>(
            `${environment.ApiUrl}Notifications/Unread`
        )
    }

    getNotificationsByUser(): Observable<any> {
        return this.http.get<any>(
            `${environment.ApiUrl}Notifications`
        )
    }

    markNotificationsAsReadForUser(): Observable<any> {
        return this.http.post(
            `${environment.ApiUrl}Notifications/MarkAsRead`, {}
        )
    }
}
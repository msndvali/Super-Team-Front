import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { NotificationService } from '../main/shared/services/notification.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {

    private unreadNotificationCountSource = new BehaviorSubject(0);
    unreadNotificationCount = this.unreadNotificationCountSource.asObservable();

    private hubConnection: signalR.HubConnection

    constructor(private notificationService: NotificationService) { }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
        // If signalr ever has issues, withCredentials might be causing it (cookies, sticky sessions)
            .withUrl(`${environment.ApiUrl}notificationsHub`, { withCredentials: false })
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err))
    }

    public addNotificationListener = () => {
        this.hubConnection.on('addNotification', (data) => {
            console.log("AddNotification called.")
            this.notificationService.getNumUnreadNotifications()
                .subscribe(data2 => {
                    this.unreadNotificationCountSource.next(data2);
                })
        });
    }

    public removeNotificationsCount() {
      this.unreadNotificationCountSource.next(0);
    }
}

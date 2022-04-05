import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../signalr/signalr.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationCount: number;
  newNotificationExists: boolean = false;
  notifications: any[] = [];

  constructor(private signalRService: SignalRService,
    private http: HttpClient, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getNotificationsByUser();
    this.signalRService.unreadNotificationCount.subscribe(count => {
      this.notificationCount = count
      if(count > 0) {
        this.newNotificationExists = true;
      }
    });
  }

  getNotificationsByUser() {
    this.notificationService.getNotificationsByUser().subscribe(data => {
      this.notifications = data;
      // Mark as Read
      this.markNotificationsAsReadForUser();
      this.signalRService.removeNotificationsCount();
    })
  }

  markNotificationsAsReadForUser() {
    this.notificationService.markNotificationsAsReadForUser().subscribe(data => { });
  }
}

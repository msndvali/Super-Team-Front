import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    NotificationRoutingModule,
    CommonModule,
    NgxSpinnerModule
  ],
  exports: [
    CommonModule
  ]
})
export class NotificationModule { }

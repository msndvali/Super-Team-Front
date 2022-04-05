import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetComponent } from './timesheet.component';

@NgModule({
  declarations: [
    TimesheetComponent
  ],
  imports: [
    TimesheetRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
  ],
  exports: [
    CommonModule
  ]
})
export class TimesheetModule { }

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddUsersRoutingModule } from './add-users-routing.module';
import { AddUsersComponent } from './add-users.component';

@NgModule({
  declarations: [
    AddUsersComponent
  ],
  imports: [
    AddUsersRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  exports: [
    CommonModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AddUsersModule { }

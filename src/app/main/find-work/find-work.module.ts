import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FindWorkRoutingModule } from './find-work-routing.module';
import { FindWorkComponent } from './find-work.component';

@NgModule({
  declarations: [
    FindWorkComponent
  ],
  imports: [
    FindWorkRoutingModule,
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule
  ]
})
export class FindWorkModule { }

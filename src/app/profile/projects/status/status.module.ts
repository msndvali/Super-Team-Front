import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSaverModule } from 'ngx-filesaver';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    StatusComponent
  ],
  imports: [
    StatusRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    NgxSpinnerModule,
    HttpClientModule,
    FileSaverModule,
    NgbModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    CommonModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class StatusModule { }

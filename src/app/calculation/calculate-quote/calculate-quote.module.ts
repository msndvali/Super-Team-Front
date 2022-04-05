import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalculateQuoteComponent } from './calculate-quote.component';
import { CalculateQuoteRoutingModule } from './calculate-quote-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxView360Module } from 'ngx-view360';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    CalculateQuoteComponent
  ],
  imports: [
    CalculateQuoteRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxView360Module,
    FileUploadModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  exports: [
    CommonModule
  ]
})
export class CalculateQuoteModule { }

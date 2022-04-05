import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { EstimatedQuoteComponent } from './estimated-quote.component';
import { EstimatedQuoteRoutingModule } from './estimated-quote-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    EstimatedQuoteComponent
  ],
  imports: [
    EstimatedQuoteRoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule
  ],
  exports: [
    CommonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EstimatedQuoteModule { }

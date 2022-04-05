import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAccordion, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    FaqRoutingModule,
    CommonModule,
    NgbAccordionModule
  ],
  exports: [
    CommonModule
  ]
})
export class FaqModule { }

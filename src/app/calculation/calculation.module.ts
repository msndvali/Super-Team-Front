import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxView360Module } from 'ngx-view360';
import { CalculationRoutingModule } from './calculation-routing.module';
import { CalculationComponent } from './calculation.component';

@NgModule({
  declarations: [
    CalculationComponent
  ],
  imports: [
    CalculationRoutingModule,
    CommonModule,
    NgxView360Module
  ],
  exports: [
    CommonModule
  ]
})
export class CalculationModule { }

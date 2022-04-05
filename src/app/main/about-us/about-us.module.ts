import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';

@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    AboutUsRoutingModule,
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class AboutUsModule { }

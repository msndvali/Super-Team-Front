import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    LayoutRoutingModule,
    CommonModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ]
})
export class LayoutModule { }

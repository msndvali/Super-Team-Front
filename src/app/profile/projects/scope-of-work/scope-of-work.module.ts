import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScopeOfWorkRoutingModule } from './scope-of-work-routing.module';
import { ScopeOfWorkComponent } from './scope-of-work.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileSaverModule } from 'ngx-filesaver';


@NgModule({
  declarations: [
    ScopeOfWorkComponent
  ],
  imports: [
    CommonModule,
    ScopeOfWorkRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    FileSaverModule
  ]
})
export class ScopeOfWorkModule { }

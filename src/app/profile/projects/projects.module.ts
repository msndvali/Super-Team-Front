import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';

@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    ProjectsRoutingModule,
    CommonModule,
    NgxSpinnerModule
  ],
  exports: [
    CommonModule
  ]
})
export class ProjectsModule { }

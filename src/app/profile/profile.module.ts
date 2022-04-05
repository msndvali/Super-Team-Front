import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    ProfileRoutingModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    FileSaverModule
  ],
  exports: [
    CommonModule
  ]
})
export class ProfileModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScopeOfWorkComponent } from './scope-of-work.component';

const scopeOfWorkRoutes: Routes = [
  { path: "", component: ScopeOfWorkComponent },
];

@NgModule({
  imports: [RouterModule.forChild(scopeOfWorkRoutes)],
  exports: [RouterModule]
})
export class ScopeOfWorkRoutingModule { }

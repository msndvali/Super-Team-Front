import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FindWorkComponent } from "./find-work.component";

const findWorkRoutes: Routes = [
  { path: "", component: FindWorkComponent },
]

@NgModule({
    imports: [RouterModule.forChild(findWorkRoutes)],
    exports: [RouterModule]
})
export class FindWorkRoutingModule {}
